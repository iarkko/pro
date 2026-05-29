import { createServer } from "http";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error", "warn"],
});

const port = Number(process.env.PORT ?? 4001);
const devAdminToken =
  process.env.NODE_ENV === "production" ? "" : "dev-guestbook-token";
const adminToken = process.env.GUESTBOOK_ADMIN_TOKEN ?? devAdminToken;
const maxBodyBytes = 8 * 1024;
const startedAt = Date.now();
const counters = {
  requests: 0,
  created: 0,
  deleted: 0,
  errors: 0,
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, text, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Cache-Control": "no-store",
    "Content-Type": contentType,
  });
  res.end(text);
}

function publicEntry(entry) {
  return {
    id: entry.id,
    name: entry.name,
    message: entry.message,
    createdAt: entry.createdAt.toISOString(),
  };
}

function normalizeString(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validateMessage(body) {
  const name = normalizeString(body.name, 60);
  const message = normalizeString(body.message, 700);

  if (name.length < 2) {
    return { error: "Name must be at least 2 characters long." };
  }

  if (message.length < 3) {
    return { error: "Message must be at least 3 characters long." };
  }

  return {
    name,
    message,
  };
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    let tooLarge = false;

    req.on("data", (chunk) => {
      if (tooLarge) {
        return;
      }

      body += chunk;

      if (Buffer.byteLength(body) > maxBodyBytes) {
        tooLarge = true;
        reject(new Error("Request body is too large."));
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });

    req.on("error", reject);
  });
}

function isAdminRequest(req) {
  return (
    Boolean(adminToken) &&
    req.headers["x-guestbook-admin-token"] === adminToken
  );
}

async function handleMessages(req, res) {
  if (req.method === "GET") {
    const entries = await prisma.guestbookEntry.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
    });
    const total = await prisma.guestbookEntry.count({
      where: {
        deletedAt: null,
      },
    });

    sendJson(res, 200, {
      entries: entries.map(publicEntry),
      total,
    });
    return;
  }

  if (req.method === "POST") {
    const body = await readJson(req);
    const normalized = validateMessage(body);

    if ("error" in normalized) {
      sendJson(res, 400, { error: normalized.error });
      return;
    }

    const entry = await prisma.guestbookEntry.create({
      data: {
        ...normalized,
        source: "portfolio-site",
      },
    });

    counters.created += 1;
    sendJson(res, 201, publicEntry(entry));
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
}

async function handleDelete(req, res, pathname) {
  if (req.method !== "DELETE") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  if (!isAdminRequest(req)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  const id = pathname.split("/").at(-1);

  if (!id) {
    sendJson(res, 400, { error: "Message id is required." });
    return;
  }

  await prisma.guestbookEntry.updateMany({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  counters.deleted += 1;
  sendJson(res, 200, { ok: true });
}

async function handleReady(res) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    sendJson(res, 200, { ok: true });
  } catch (err) {
    counters.errors += 1;
    sendJson(res, 503, {
      ok: false,
      error: err instanceof Error ? err.message : "Database is not ready",
    });
  }
}

function handleMetrics(res) {
  const uptimeSeconds = Math.floor((Date.now() - startedAt) / 1000);
  const lines = [
    "# HELP guestbook_uptime_seconds Guestbook service uptime.",
    "# TYPE guestbook_uptime_seconds gauge",
    `guestbook_uptime_seconds ${uptimeSeconds}`,
    "# HELP guestbook_requests_total Total HTTP requests handled.",
    "# TYPE guestbook_requests_total counter",
    `guestbook_requests_total ${counters.requests}`,
    "# HELP guestbook_messages_created_total Total created guestbook messages.",
    "# TYPE guestbook_messages_created_total counter",
    `guestbook_messages_created_total ${counters.created}`,
    "# HELP guestbook_messages_deleted_total Total deleted guestbook messages.",
    "# TYPE guestbook_messages_deleted_total counter",
    `guestbook_messages_deleted_total ${counters.deleted}`,
    "# HELP guestbook_errors_total Total handled service errors.",
    "# TYPE guestbook_errors_total counter",
    `guestbook_errors_total ${counters.errors}`,
    "",
  ];

  sendText(
    res,
    200,
    lines.join("\n"),
    "text/plain; version=0.0.4; charset=utf-8"
  );
}

const server = createServer(async (req, res) => {
  counters.requests += 1;

  try {
    const url = new URL(
      req.url ?? "/",
      `http://${req.headers.host ?? "localhost"}`
    );

    if (url.pathname === "/healthz") {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (url.pathname === "/readyz") {
      await handleReady(res);
      return;
    }

    if (url.pathname === "/metrics") {
      handleMetrics(res);
      return;
    }

    if (url.pathname === "/messages") {
      await handleMessages(req, res);
      return;
    }

    if (url.pathname.startsWith("/messages/")) {
      await handleDelete(req, res, url.pathname);
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (err) {
    counters.errors += 1;
    sendJson(res, 500, {
      error: err instanceof Error ? err.message : "Internal Server Error",
    });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Guestbook service listening on ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

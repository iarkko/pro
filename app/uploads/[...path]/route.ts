import { readFile } from "fs/promises";
import path from "path";

const MIME_BY_EXT: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};
const UPLOAD_DIR = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
  "uploads"
);

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await context.params;

  if (!segments?.length || segments.some((segment) => segment.includes(".."))) {
    return new Response("Not found", { status: 404 });
  }

  const uploadDir = path.resolve(UPLOAD_DIR);
  const filePath = path.resolve(uploadDir, ...segments);

  if (!filePath.startsWith(`${uploadDir}${path.sep}`)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    const contentType =
      MIME_BY_EXT[path.extname(filePath).toLowerCase()] ??
      "application/octet-stream";

    return new Response(new Uint8Array(file), {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

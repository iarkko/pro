import { NextResponse } from "next/server";
import { guestbookUrl } from "@/app/lib/guestbook-service";
import { getCurrentUser } from "@/app/lib/auth";

function buildGuestbookHeaders(userId?: string, role?: string) {
  const headers: Record<string, string> = {};

  if (userId) {
    headers["x-guestbook-user-id"] = userId;
  }

  if (role) {
    headers["x-guestbook-user-role"] = role;
  }

  return headers;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    const response = await fetch(guestbookUrl("/messages"), {
      cache: "no-store",
      headers: buildGuestbookHeaders(user?.id, user?.role),
    });
    const payload = await response.json();

    return NextResponse.json(payload, { status: response.status });
  } catch (err) {
    console.error("GUESTBOOK GET ERROR:", err);
    return NextResponse.json(
      { error: "Guestbook service is unavailable" },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const response = await fetch(guestbookUrl("/messages"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...buildGuestbookHeaders(user?.id, user?.role),
      },
      body: JSON.stringify(body),
    });
    const payload = await response.json();

    return NextResponse.json(payload, { status: response.status });
  } catch (err) {
    console.error("GUESTBOOK POST ERROR:", err);
    return NextResponse.json(
      { error: "Guestbook service is unavailable" },
      { status: 503 }
    );
  }
}

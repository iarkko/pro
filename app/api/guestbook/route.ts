import { NextResponse } from "next/server";
import { guestbookUrl } from "@/app/lib/guestbook-service";

export async function GET() {
  try {
    const response = await fetch(guestbookUrl("/messages"), {
      cache: "no-store",
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
    const body = await req.json();
    const response = await fetch(guestbookUrl("/messages"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

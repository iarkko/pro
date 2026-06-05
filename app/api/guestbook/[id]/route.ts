import { NextRequest, NextResponse } from "next/server";
import { getApiUser } from "@/app/lib/api-auth";
import {
  guestbookAdminHeaders,
  guestbookUrl,
} from "@/app/lib/guestbook-service";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await getApiUser("delete");

  if (auth.response) {
    return auth.response;
  }

  const { id } = await context.params;

  try {
    const response = await fetch(
      guestbookUrl(`/messages/${encodeURIComponent(id)}`),
      {
        method: "DELETE",
        headers: {
          ...guestbookAdminHeaders(),
          "x-guestbook-user-id": auth.user.id,
          "x-guestbook-user-role": auth.user.role,
        },
      }
    );
    const payload = await response.json();

    return NextResponse.json(payload, { status: response.status });
  } catch (err) {
    console.error("GUESTBOOK DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Guestbook service is unavailable" },
      { status: 503 }
    );
  }
}

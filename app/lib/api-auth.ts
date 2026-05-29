import "server-only";

import { NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/app/lib/auth";
import type { Permission } from "@/types/auth";

export async function getApiUser(permission: Permission) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!hasPermission(user, permission)) {
    return {
      user: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {
    user,
    response: null,
  };
}

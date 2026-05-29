import "server-only";

import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/app/lib/prisma";
import type { AuthPermissions, AuthUserView, Permission } from "@/types/auth";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = "pro_session";
const SESSION_DAYS = 30;

type AuthDbUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  canRead: boolean;
  canCreate: boolean;
  canDelete: boolean;
};

function getSessionExpiry() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);
  return expiresAt;
}

function toPermissions(user: AuthDbUser): AuthPermissions {
  return {
    read: user.canRead,
    create: user.canCreate,
    delete: user.canDelete,
  };
}

function toUserView(user: AuthDbUser): AuthUserView {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? user.email,
    role: user.role,
    permissions: toPermissions(user),
  };
}

export function hasPermission(
  user: AuthUserView | null,
  permission: Permission
) {
  return Boolean(user?.permissions[permission]);
}

export function isOwner(user: AuthUserView | null) {
  return user?.role === "owner";
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password: string, passwordHash: string) {
  const [scheme, salt, storedKey] = passwordHash.split(":");

  if (scheme !== "scrypt" || !salt || !storedKey) {
    return false;
  }

  const stored = Buffer.from(storedKey, "base64url");
  const derived = (await scrypt(password, salt, stored.length)) as Buffer;

  return (
    stored.length === derived.length && timingSafeEqual(stored, derived)
  );
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("base64url");
}

function getCookieOptions(expires: Date) {
  const secure =
    process.env.AUTH_COOKIE_SECURE === "true" ||
    (process.env.NODE_ENV === "production" &&
      process.env.AUTH_COOKIE_SECURE !== "false");

  return {
    expires,
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure,
  };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = getSessionExpiry();

  await prisma.authSession.create({
    data: {
      tokenHash: hashSessionToken(token),
      userId,
      expiresAt,
    },
  });

  await prisma.authSession.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, getCookieOptions(expiresAt));
}

export const getCurrentUser = cache(async (): Promise<AuthUserView | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.authSession.findUnique({
    where: {
      tokenHash: hashSessionToken(token),
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return toUserView(session.user);
});

export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.authSession.deleteMany({
      where: {
        tokenHash: hashSessionToken(token),
      },
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export function normalizeNextPath(value: FormDataEntryValue | string | null) {
  const nextPath = typeof value === "string" ? value : "";

  if (
    !nextPath.startsWith("/") ||
    nextPath.startsWith("//") ||
    nextPath.includes("://")
  ) {
    return "/";
  }

  return nextPath;
}

export async function requirePermission(permission: Permission) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!hasPermission(user, permission)) {
    throw new Error("Forbidden");
  }

  return user;
}

export async function requireOwner() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!isOwner(user)) {
    throw new Error("Forbidden");
  }

  return user;
}

export async function requireOwnerPage(nextPath: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  if (!isOwner(user)) {
    redirect(
      `/login?error=forbidden&next=${encodeURIComponent(nextPath)}`
    );
  }

  return user;
}

export async function requirePagePermission(
  permission: Permission,
  nextPath: string
) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  if (!hasPermission(user, permission)) {
    redirect(
      `/login?error=forbidden&next=${encodeURIComponent(nextPath)}`
    );
  }

  return user;
}

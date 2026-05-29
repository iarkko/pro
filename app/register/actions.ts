"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  hashPassword,
  normalizeNextPath,
} from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function register(formData: FormData) {
  const name = getString(formData.get("name"));
  const email = getString(formData.get("email")).toLowerCase();
  const password = getString(formData.get("password"));
  const confirmPassword = getString(formData.get("confirmPassword"));
  const nextPath = normalizeNextPath(formData.get("next"));

  if (!email || !password || !confirmPassword) {
    redirect(`/register?error=missing&next=${encodeURIComponent(nextPath)}`);
  }

  if (password !== confirmPassword) {
    redirect(
      `/register?error=passwordMismatch&next=${encodeURIComponent(nextPath)}`
    );
  }

  if (password.length < 8) {
    redirect(`/register?error=short&next=${encodeURIComponent(nextPath)}`);
  }

  const existingUser = await prisma.authUser.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    redirect(`/register?error=emailTaken&next=${encodeURIComponent(nextPath)}`);
  }

  const user = await prisma.authUser.create({
    data: {
      email,
      name: name || null,
      passwordHash: await hashPassword(password),
      role: "reader",
      canRead: true,
      canCreate: false,
      canDelete: false,
    },
  });

  await createSession(user.id);
  redirect(nextPath);
}

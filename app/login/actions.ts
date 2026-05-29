"use server";

import { redirect } from "next/navigation";
import {
  createSession,
  destroyCurrentSession,
  normalizeNextPath,
  verifyPassword,
} from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function login(formData: FormData) {
  const email = getString(formData.get("email")).toLowerCase();
  const password = getString(formData.get("password"));
  const nextPath = normalizeNextPath(formData.get("next"));

  if (!email || !password) {
    redirect(
      `/login?error=missing&next=${encodeURIComponent(nextPath)}`
    );
  }

  const user = await prisma.authUser.findUnique({
    where: {
      email,
    },
  });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    redirect(
      `/login?error=invalid&next=${encodeURIComponent(nextPath)}`
    );
  }

  await createSession(user.id);
  redirect(nextPath);
}

export async function logout() {
  await destroyCurrentSession();
  redirect("/login");
}

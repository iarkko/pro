"use server";

import { revalidatePath } from "next/cache";
import { hashPassword, requireOwner } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

const ADMIN_USERS_PATH = "/admin/users";

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getRole(canRead: boolean, canCreate: boolean, canDelete: boolean) {
  if (canRead && canCreate && canDelete) return "owner";
  if (canRead && canCreate && !canDelete) return "creator";
  if (canRead && !canCreate && canDelete) return "deleter";
  if (canRead && !canCreate && !canDelete) return "reader";
  return "custom";
}

function getClientRole(
  canRead: boolean,
  canCreate: boolean,
  canDelete: boolean
) {
  if (canRead && canCreate && canDelete) {
    throw new Error("Full access is reserved for the owner account");
  }

  const role = getRole(canRead, canCreate, canDelete);
  return role === "owner" ? "custom" : role;
}

async function getEditableClient(id: string) {
  const client = await prisma.authUser.findUnique({
    where: { id },
    select: {
      id: true,
      role: true,
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  if (client.role === "owner") {
    throw new Error("Owner accounts are managed outside this panel");
  }

  return client;
}

export async function createClient(formData: FormData) {
  await requireOwner();

  const email = getString(formData.get("email")).toLowerCase();
  const name = getString(formData.get("name"));
  const password = getString(formData.get("password"));
  const canRead = getBoolean(formData, "canRead");
  const canCreate = getBoolean(formData, "canCreate");
  const canDelete = getBoolean(formData, "canDelete");

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  await prisma.authUser.create({
    data: {
      email,
      name: name || null,
      passwordHash: await hashPassword(password),
      role: getClientRole(canRead, canCreate, canDelete),
      canRead,
      canCreate,
      canDelete,
    },
  });

  revalidatePath(ADMIN_USERS_PATH);
}

export async function updateClientPermissions(formData: FormData) {
  await requireOwner();

  const id = getString(formData.get("id"));
  const name = getString(formData.get("name"));
  const canRead = getBoolean(formData, "canRead");
  const canCreate = getBoolean(formData, "canCreate");
  const canDelete = getBoolean(formData, "canDelete");

  await getEditableClient(id);

  await prisma.authUser.update({
    where: { id },
    data: {
      name: name || null,
      role: getClientRole(canRead, canCreate, canDelete),
      canRead,
      canCreate,
      canDelete,
    },
  });

  revalidatePath(ADMIN_USERS_PATH);
}

export async function resetClientPassword(formData: FormData) {
  await requireOwner();

  const id = getString(formData.get("id"));
  const password = getString(formData.get("password"));

  if (!password) {
    throw new Error("Password is required");
  }

  await getEditableClient(id);

  await prisma.authUser.update({
    where: { id },
    data: {
      passwordHash: await hashPassword(password),
      sessions: {
        deleteMany: {},
      },
    },
  });

  revalidatePath(ADMIN_USERS_PATH);
}

export async function deleteClient(formData: FormData) {
  await requireOwner();

  const id = getString(formData.get("id"));

  await getEditableClient(id);

  await prisma.authUser.delete({
    where: { id },
  });

  revalidatePath(ADMIN_USERS_PATH);
}

"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

const TODO_PATH = "/todo";
const priorities = new Set(["low", "medium", "high"]);

function getString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getPriority(value: FormDataEntryValue | null) {
  const priority = getString(value);
  return priorities.has(priority) ? priority : "medium";
}

function getDueDate(value: FormDataEntryValue | null) {
  const dueDate = getString(value);

  if (!dueDate) {
    return null;
  }

  const parsedDate = new Date(`${dueDate}T00:00:00.000Z`);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export async function createTodoTask(formData: FormData) {
  await requirePermission("create");

  const title = getString(formData.get("title"));

  if (!title) {
    return;
  }

  const description = getString(formData.get("description"));

  await prisma.todoTask.create({
    data: {
      title,
      description: description || null,
      priority: getPriority(formData.get("priority")),
      dueDate: getDueDate(formData.get("dueDate")),
    },
  });

  revalidatePath(TODO_PATH);
}

export async function toggleTodoTask(formData: FormData) {
  await requirePermission("create");

  const id = getString(formData.get("id"));

  if (!id) {
    return;
  }

  await prisma.todoTask.updateMany({
    where: { id },
    data: {
      completed: getString(formData.get("completed")) === "true",
    },
  });

  revalidatePath(TODO_PATH);
}

export async function deleteTodoTask(formData: FormData) {
  await requirePermission("delete");

  const id = getString(formData.get("id"));

  if (!id) {
    return;
  }

  await prisma.todoTask.deleteMany({
    where: { id },
  });

  revalidatePath(TODO_PATH);
}

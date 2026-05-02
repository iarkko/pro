import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

// GET
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  return Response.json(recipe);
}

// UPDATE
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const updated = await prisma.recipe.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
      steps: body.steps,
    },
  });

  return Response.json(updated);
}

// DELETE
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.recipe.delete({
    where: { id },
  });

  return Response.json({ ok: true });
}
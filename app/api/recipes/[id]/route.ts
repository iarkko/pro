import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  _req: NextRequest,
  context: Context
) {
  const { id } = await context.params;

  await prisma.recipe.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}

export async function PUT(
  req: NextRequest,
  context: Context
) {
  const { id } = await context.params;
  const body = await req.json();

  const updated = await prisma.recipe.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description ?? null,
      imageUrl: body.imageUrl ?? null,
      steps: body.steps ?? [],
    },
  });

  return NextResponse.json(updated);
}
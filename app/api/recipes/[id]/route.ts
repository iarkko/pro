import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: Context) {
  const { id } = await context.params;

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: { steps: true },
  });

  return NextResponse.json(recipe);
}

export async function PUT(req: NextRequest, context: Context) {
  const { id } = await context.params;
  const body = await req.json();

  await prisma.step.deleteMany({
    where: { recipeId: id },
  });

  const updated = await prisma.recipe.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
      steps: {
        create: (body.steps ?? []).map((text: string, i: number) => ({
          text,
          order: i,
        })),
      },
    },
    include: { steps: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, context: Context) {
  const { id } = await context.params;

  await prisma.recipe.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
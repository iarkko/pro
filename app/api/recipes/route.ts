import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET
export async function GET() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(recipes);
}

// POST
export async function POST(req: Request) {
  const body = await req.json();

  const recipe = await prisma.recipe.create({
    data: {
      title: body.title,
      description: body.description || "",
      imageUrl: body.imageUrl || "",
      steps: body.steps || [],
    },
  });

  return NextResponse.json(recipe);
}

// PUT
export async function PUT(req: Request) {
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const updated = await prisma.recipe.update({
    where: { id: id! },
    data: {
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
      steps: body.steps,
    },
  });

  return NextResponse.json(updated);
}

// DELETE
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await prisma.recipe.delete({
    where: { id: id! },
  });

  return NextResponse.json({ ok: true });
}
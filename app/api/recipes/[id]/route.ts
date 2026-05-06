import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import type { RecipeInput, RecipeStep } from "@/types/recipe";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(err) },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = (await req.json()) as RecipeInput;

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        title: body.title || "Untitled",
        description: body.description || "",
        imageUrl: body.imageUrl || "",
        steps: {
          deleteMany: {},
          create: (body.steps ?? []).map((s: RecipeStep, i: number) => ({
            text: s.text || "",
            imageUrl: s.imageUrl ?? null,
            stepOrder: i,
          })),
        },
      } as Prisma.RecipeUpdateInput,
      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
      },
    });

    return NextResponse.json(recipe);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Update failed", details: String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.recipe.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);

    return NextResponse.json(
      {
        error: "Delete failed",
        details: String(err),
      },
      { status: 500 }
    );
  }
}
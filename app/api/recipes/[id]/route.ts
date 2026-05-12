import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import type { RecipeInput, RecipeStep } from "@/types/recipe";

type RecipeWithSteps = Prisma.RecipeGetPayload<{
  include: { steps: true };
}>;

function toClientRecipe(recipe: RecipeWithSteps) {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description ?? "",
    imageUrl: recipe.imageUrl ?? "",
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    steps: recipe.steps
      .sort((a, b) => a.stepOrder - b.stepOrder)
      .map((step) => ({
        id: step.id,
        text: step.text,
        imageUrl: step.imageUrl ?? "",
        stepOrder: step.stepOrder,
      })),
  };
}

function normalizeRecipeInput(body: RecipeInput) {
  const title = body.title?.trim();

  if (!title) {
    throw new Error("Recipe title is required");
  }

  const steps = (body.steps ?? [])
    .map((step: RecipeStep) => ({
      text: step.text?.trim() ?? "",
      imageUrl: step.imageUrl || "",
    }))
    .filter((step) => step.text || step.imageUrl);

  return {
    title,
    description: body.description?.trim() ?? "",
    imageUrl: body.imageUrl || "",
    steps,
  };
}

export async function GET(
  _req: NextRequest,
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

    return NextResponse.json(toClientRecipe(recipe));
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
    const body = normalizeRecipeInput((await req.json()) as RecipeInput);

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        steps: {
          deleteMany: {},
          create: (body.steps ?? []).map((s: RecipeStep, i: number) => ({
            text: s.text,
            imageUrl: s.imageUrl || null,
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

    return NextResponse.json(toClientRecipe(recipe));
  } catch (err) {
    console.error("UPDATE ERROR:", err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return NextResponse.json(
          { error: "Recipe not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Update failed",
      },
      { status: err instanceof Error ? 400 : 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
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

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return NextResponse.json(
          { error: "Recipe not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Delete failed",
        details: String(err),
      },
      { status: 500 }
    );
  }
}

import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getApiUser } from "@/app/lib/api-auth";
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

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
      },
    });

    return NextResponse.json(recipes.map(toClientRecipe));
  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load recipes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await getApiUser("create");

  if (auth.response) {
    return auth.response;
  }

  try {
    const body = normalizeRecipeInput((await req.json()) as RecipeInput);

    const recipe = await prisma.recipe.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        steps: {
          create: (body.steps ?? []).map((s: RecipeStep, i: number) => ({
            text: s.text,
            imageUrl: s.imageUrl || null,
            stepOrder: i,
          })),
        },
      } as Prisma.RecipeCreateInput,
      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
      },
    });

    return NextResponse.json(toClientRecipe(recipe), { status: 201 });
  } catch (err) {
    console.error("CREATE ERROR:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to create the recipe",
      },
      { status: err instanceof Error ? 400 : 500 }
    );
  }
}

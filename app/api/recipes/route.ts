import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import type { RecipeInput, RecipeStep } from "@/types/recipe";

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

    return Response.json(recipes);
  } catch (err) {
    console.error("GET ERROR:", err);
    return Response.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RecipeInput;

    const recipe = await prisma.recipe.create({
      data: {
        title: body.title || "Untitled",
        description: body.description || "",
        imageUrl: body.imageUrl || "",
        notionUrl: body.notionUrl ?? null,

        steps: {
          create: (body.steps ?? []).map((s: RecipeStep, i: number) => ({
            text: s.text || "",
            imageUrl: s.imageUrl ?? null,
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

    return Response.json(recipe);
  } catch (err) {
    console.error("CREATE ERROR:", err);

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: String(err),
      }),
      { status: 500 }
    );
  }
}

import { prisma } from "@/app/lib/prisma";

// GET all recipes
export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        steps: true,
      },
    });

    return Response.json(recipes);
  } catch (err) {
    console.error("GET RECIPES ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// CREATE recipe
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const recipe = await prisma.recipe.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl ?? "",
        steps: {
          create: (body.steps ?? []).map((text: string, i: number) => ({
            text,
            stepOrder: i, // ← ВАЖНО: было "order", стало "stepOrder"
          })),
        },
      },
      include: {
        steps: true,
      },
    });

    return Response.json(recipe);
  } catch (err) {
    console.error("CREATE RECIPE ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
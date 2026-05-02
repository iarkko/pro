import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// GET all recipes
export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
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
        steps: body.steps ?? [],
      },
    });

    return Response.json(recipe);
  } catch (err) {
    console.error("CREATE RECIPE ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
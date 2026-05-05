import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        steps: {
          orderBy: { stepOrder: "asc" }, // 🔥 важно
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
    const body = await req.json();

    const recipe = await prisma.recipe.create({
      data: {
        title: body.title || "Untitled",
        description: body.description || "",
        imageUrl: body.imageUrl || "",

        steps: {
          create: (body.steps ?? []).map((s: any, i: number) => ({
            text: s.text || "",
            imageUrl: s.imageUrl ?? null,
            stepOrder: i,
          })),
        },
      },
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
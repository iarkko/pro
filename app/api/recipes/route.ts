import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET
export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(recipes);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST
export async function POST(req: Request) {
  try {
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
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "No id" }, { status: 400 });
    }

    await prisma.recipe.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
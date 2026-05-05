import { prisma } from "@/app/lib/prisma";

export const RecipeService = {
  async getAll() {
    return prisma.recipe.findMany({
      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.recipe.findUnique({
      where: { id },
      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
      },
    });
  },

  async create(data: {
    title: string;
    description?: string;
    imageUrl?: string;
    steps?: { text: string; imageUrl?: string }[];
  }) {
    return prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description ?? "",
        imageUrl: data.imageUrl ?? "",

        steps: {
          create: (data.steps ?? []).map((s, index) => ({
            text: s.text,
            imageUrl: s.imageUrl ?? null,
            stepOrder: index,
          })),
        },
      },
      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
      },
    });
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      imageUrl?: string;
      steps?: { text: string; imageUrl?: string }[];
    }
  ) {
    return prisma.recipe.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description ?? "",
        imageUrl: data.imageUrl ?? "",

        steps: data.steps
          ? {
              deleteMany: {},

              create: data.steps.map((s, index) => ({
                text: s.text,
                imageUrl: s.imageUrl ?? null,
                stepOrder: index,
              })),
            }
          : undefined,
      },

      include: {
        steps: {
          orderBy: { stepOrder: "asc" },
        },
      },
    });
  },

  async delete(id: string) {
    return prisma.recipe.delete({
      where: { id },
    });
  },
};
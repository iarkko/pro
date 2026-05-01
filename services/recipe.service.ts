import { prisma } from "@/lib/prisma";

export const RecipeService = {
  async getAll() {
    return prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    return prisma.recipe.findUnique({
      where: { id },
    });
  },

  async create(data: {
    title: string;
    description?: string;
    imageUrl?: string;
    steps?: string[];
  }) {
    return prisma.recipe.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        imageUrl: data.imageUrl ?? "",
        steps: data.steps ?? [],
      },
    });
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      imageUrl?: string;
      steps?: string[];
    }
  ) {
    return prisma.recipe.update({
      where: { id },
      data: {
        ...data,
        description: data.description ?? undefined,
      },
    });
  },

  async delete(id: string) {
    return prisma.recipe.delete({
      where: { id },
    });
  },
};
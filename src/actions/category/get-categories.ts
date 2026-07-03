"use server";

import prisma from "@/lib/prisma";

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return {
      resp: true,
      data: categories,
    };
  } catch (error: any) {
    return {
      resp: false,
      data: [],
      message: error.message,
    };
  }
};

"use server";

import prisma from "@/lib/prisma";

export const getStockBySlug = async function (
  slug: string
): Promise<number | null> {
  try {
    const product = await prisma.product.findFirst({
      include: {
        ProductImage: {},
      },
      where: {
        slug: slug,
      },
    });
    if (!product) return null;
    return product.inStock;
  } catch (e) {
    throw new Error(`Error al obtener el producto por slug: ${e}`);
  }
};

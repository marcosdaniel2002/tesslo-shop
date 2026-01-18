"use server";

import { Product } from "@/interfaces/product.interfaces";
import prisma from "@/lib/prisma";

export const getProductBySlug = async function (
  slug: string
): Promise<Product | null> {
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
    return product;
  } catch (e) {
    throw new Error(`Error al obtener el producto por slug: ${e}`);
  }
};

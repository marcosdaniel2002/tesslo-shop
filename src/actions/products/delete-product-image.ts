"use server";

import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config(process.env.CLOUDINARY_URL || "");

export const deleteProductImage = async function (imageId: number) {
  try {
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) throw new Error("Imagen no encontrada");

    if (!image.url.startsWith("https://res.cloudinary.com/"))
      throw new Error("La imagen no es de Cloudinary");

    const imageName = image.url.split("/").pop()?.split(".")[0] ?? "";

    await cloudinary.uploader.destroy(imageName);
    const deletedImage = await prisma.productImage.delete({
      where: { id: imageId },
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    // REVALIDAR PATHS DE PRODUCTOS
    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${deletedImage.product.slug}`);
    revalidatePath(`/products/${deletedImage.product.slug}`);

    return {
      resp: true,
      message: "Imagen eliminada correctamente",
    };
  } catch (error: any) {
    return {
      resp: false,
      message: error.message || "Error al eliminar la imagen",
    };
  }
};

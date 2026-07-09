"use server";

import prisma from "@/lib/prisma";
import { deleteProductImage as deleteProductImageFile } from "@/lib/product-images";
import { revalidatePath } from "next/cache";

export const deleteProductImage = async function (imageId: number) {
  try {
    const image = await prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) throw new Error("Imagen no encontrada");

    // Las URLs que empiezan con http son imágenes legadas (ej. Cloudinary),
    // ya no se administran desde aquí; solo se borra el registro.
    if (!image.url.startsWith("http")) {
      await deleteProductImageFile(image.url);
    }

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

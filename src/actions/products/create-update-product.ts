"use server";

import { Product } from "@/generated/prisma/client";
import { Gender, Size } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { saveProductImage } from "@/lib/product-images";
import { revalidatePath } from "next/cache";
import z from "zod";

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().toLowerCase().trim().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.split(",")),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async function (formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const productParsed = productSchema.safeParse(data);
    if (!productParsed.success) {
      throw new Error(`Error de validación: ${productParsed.error.message}`);
    }

    const product = productParsed.data;
    const { id, ...productData } = product;

    // USAR TRANSACTION PARA ROLLBACK
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;
      if (id) {
        // ACTUALIZAR
        product = await tx.product.update({
          where: { id },
          data: {
            ...productData,
            sizes: {
              set: productData.sizes as Size[],
            },
            tags: {
              set: productData.tags.split(",").map((tag) => tag.trim()),
            },
          },
        });
      } else {
        // CREAR
        product = await tx.product.create({
          data: {
            ...productData,
            sizes: {
              set: productData.sizes as Size[],
            },
            tags: {
              set: productData.tags.split(",").map((tag) => tag.trim()),
            },
          },
        });
      }

      // PROCESO DE CARGA Y GUARDADO DE IMAGENES

      // RECORRER LAS IMAGENES Y GUARDARLAS
      const imageFiles = formData
        .getAll("images")
        .filter((image): image is File => image instanceof File && image.size > 0);

      if (imageFiles.length > 0) {
        // ['asdasd.jpg', 'qweqwe.png'] -> se sirven desde /products/<filename>
        const images = await uploadImages(imageFiles);
        if (!images) throw new Error("Error al subir las imágenes");

        await tx.productImage.createMany({
          data: images.map((url) => ({
            url,
            productId: product.id,
          })),
        });
      }

      return {
        product,
      };
    });

    // REVALIDAR PATHS DE PRODUCTOS
    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${prismaTx.product.slug}`);
    revalidatePath(`/products/${prismaTx.product.slug}`);

    return {
      resp: true,
      message: "Producto creado/actualizado correctamente",
      product: prismaTx.product,
    };
  } catch (e: any) {
    console.log({ e });
    return {
      resp: false,
      error: e.message,
    };
  }
};

const uploadImages = async function (images: File[]): Promise<string[]> {
  try {
    const uploadPromises = images.map((image) => saveProductImage(image));
    return await Promise.all(uploadPromises);
  } catch (e: any) {
    throw new Error("Error al subir las imágenes: " + e.message);
  }
};

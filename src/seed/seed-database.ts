import { initialData } from "./seed";
import prisma from "../lib/prisma";

async function main() {
  // BORRAR REGISTROS PREVIOS
  await Promise.all([
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
  ]);

  // CATEGORIAS
  const { categories, products } = initialData;
  const categoriesData = categories.map((category) => ({
    name: category,
  }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();
  const categoriesObject = categoriesDB.reduce((object, category) => {
    object[category.name.toLowerCase()] = category.id;
    return object;
  }, {} as Record<string, string>);

  // PRODUCTOS

  products.forEach(async (product) => {
    const { type, images, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesObject[type],
      },
    });

    // IMAGENES
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));
    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  console.log("Seed ejecutado correctamente...");
}

main();

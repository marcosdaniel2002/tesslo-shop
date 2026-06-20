"use server";

import { auth } from "@/auth";
import { Size } from "@/generated/prisma/enums";
import { Address } from "@/interfaces/address.interface";
import prisma from "@/lib/prisma";
import { ta } from "zod/v4/locales";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export async function placeOrder(products: ProductToOrder[], address: Address) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      throw new Error("No hay session de usuario");
    }

    // OBTENER INFORMACION DE LOS PRODUCTOS
    const productsBD = await prisma.product.findMany({
      where: {
        id: {
          in: products.map((p) => p.productId),
        },
      },
    });

    // CALCULAR LOS MONTOS PARA LA CABECERA
    const itemsInOrder = products.reduce(
      (value, item) => value + item.quantity,
      0,
    );

    const { subtotal, tax, total } = products.reduce(
      (value, item) => {
        const productQuantity = item.quantity;

        const product = productsBD.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error(`${item.productId} no existe`);
        }

        const subtotal = product.price * productQuantity;
        value.subtotal += subtotal;
        value.tax += subtotal * 0.15;
        value.total += subtotal * 1.15;

        return value;
      },
      { subtotal: 0, tax: 0, total: 0 },
    );

    // TRANSACCION A LA BASE DE DATOS CON WITH TRANSACTION
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = productsBD.map((product) => {
        // acumular la cantidad
        const productQuantity = products
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0)
          throw new Error(
            `El producto con id: ${product.id} no tiene cantidad definida`,
          );

        return tx.product.update({
          where: { id: product.id },
          data: {
            // inStock: product.inStock - productQuantity,
            inStock: {
              decrement: productQuantity, // ESTO ESTA CORRECTO
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      // VERIFICAR VALORES NEGATIVOS EN EL STOCK
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(
            `El producto: ${product.title} no tiene cantidad suficiente`,
          );
        }
      });

      // 2. Crear la ORDEN Y DETALLES
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subtotal,
          tax: tax,
          total: total,
          OrderItem: {
            createMany: {
              data: products.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                  productsBD.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });

      // 3. Crear la DIRECCION de la orden
      const country = await tx.country.findUnique({
        where: {
          id: address.country,
        },
      });
      if (!country) {
        throw new Error(
          "No se pudo crear la direccion de la orden, el país seleccionado no es válido",
        );
      }

      const orderAddress = await tx.orderAddress.create({
        data: {
          orderId: order.id,
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          address2: address.address2,
          postalCode: address.postalCode,
          city: address.city,
          countryId: country.id,
          phone: address.phone,
        },
      });

      return {
        order: order,
        updatedProducts: updatedProducts,
        orderAddress: orderAddress,
      };
    });

    return {
      ok: true,
      message: "Order registrada correctamente",
      data: {
        order: prismaTx.order,
      },
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Error desconocido",
    };
  }
}

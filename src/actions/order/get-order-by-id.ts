"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const getOrderById = async (orderId: string) => {
  const session = await auth();
  if (!session?.user) throw new Error("No se encontro usuario");

  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        OrderItem: {
          include: {
            product: {
              include: {
                ProductImage: {
                  take: 1,
                },
              },
            },
          },
        },
        orderAddress: {
          include: {
            country: true,
          },
        },
      },
    });
    if (!order) throw new Error("No se encontro orden");
    if (order.userId !== session.user.id)
      throw new Error("No tienes permiso para ver esta orden");

    return {
      resp: true,
      data: {
        order,
      },
    };
  } catch (err: any) {
    return {
      resp: false,
      message: err.message,
    };
  }
};

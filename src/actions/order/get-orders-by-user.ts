"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const getOrdersByUser = async () => {
  const session = await auth();
  if (!session?.user) throw new Error("No se encontro usuario");

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      resp: true,
      data: {
        orders,
      },
    };
  } catch (err: any) {
    return {
      resp: false,
      message: err.message,
    };
  }
};

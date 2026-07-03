"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const getPaginatedOrders = async () => {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("No se encontro usuario");

    if (session?.user.role !== "admin")
      throw new Error("Debe ser administrador para acceder a esta información");

    const orders = await prisma.order.findMany({
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

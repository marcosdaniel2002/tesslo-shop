"use server";

import prisma from "@/lib/prisma";

export async function setTransactionId(orderId: string, transactionId: string) {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId: transactionId,
      },
    });
    if (!order) throw new Error("No se encontro la orden");
    return {
      resp: true,
      data: {
        order,
      },
    };
  } catch (error: any) {
    return {
      resp: false,
      message: error.message,
    };
  }
}

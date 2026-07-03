"use server";

import { PayPalOrderStatusResponse } from "@/interfaces/paypal";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (transactionId: string) => {
  try {
    const token = await getPaypalToken();
    if (!token) throw new Error("No token received from PayPal");

    const data = await verifyPaypalPayment(transactionId, token);
    const { status, purchase_units } = data;
    const { invoice_id: orderId } = purchase_units[0];

    if (status !== "COMPLETED") throw new Error("Payment not completed");

    // REALIZAR LA ACTUALIZACION DE LA ORDEN EN LA BASE DE DATOS
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    // REVALIDAR PATH
    revalidatePath(`/orders/${orderId}`);
    return {
      resp: true,
    };
  } catch (error: any) {
    return {
      resp: false,
      message: error.message,
    };
  }
};

const getPaypalToken = async () => {
  const base64Token = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
  ).toString("base64");

  const response = await fetch(`${process.env.PAYPAL_OAUTH_URL}`, {
    headers: {
      Authorization: `Basic ${base64Token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    method: "POST",
  });
  const data = await response.json();
  return data.access_token;
};

const verifyPaypalPayment = async (transactionId: string, token: string) => {
  const response = await fetch(
    `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    },
  );
  const data: PayPalOrderStatusResponse = await response.json();
  return data;
};

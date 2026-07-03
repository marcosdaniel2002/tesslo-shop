"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (
  userId: string,
  newRole: "user" | "admin",
) => {
  try {
    const session = await auth();
    if (session?.user.role !== "admin") throw new Error("No autorizado");

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
    });
    revalidatePath("/admin/users");
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

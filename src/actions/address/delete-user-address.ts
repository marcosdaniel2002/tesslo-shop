"use server";

import prisma from "@/lib/prisma";

export async function deleteUserAddress(userId: string) {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: { userId },
    });

    if (!storedAddress) {
      return {
        ok: true,
        message: "No existia direccion",
      };
    }

    await prisma.userAddress.delete({
      where: { userId },
    });
    return {
      ok: true,
      message: "Se elimino con exito",
    };
  } catch (err) {
    return {
      ok: false,
      message: "No se pudo eliminar direccion de usuario",
    };
  }
}

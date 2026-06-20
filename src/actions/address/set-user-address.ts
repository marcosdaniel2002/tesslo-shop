"use server";

import { Address } from "@/interfaces/address.interface";
import prisma from "@/lib/prisma";

export async function setUserAddress(address: Address, userId: string) {
  try {
    const newAddress = await createOrReplaceAddress(address, userId);
    return {
      ok: true,
      address: newAddress,
    };
  } catch (err) {
    return {
      ok: false,
      message: "No se pudo grabar la direccion",
    };
  }
}

async function createOrReplaceAddress(address: Address, userId: string) {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: { userId },
    });

    const addressToSave = {
      userId: userId,
      address: address.address,
      address2: address.address2,
      countryId: address.country,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
      city: address.city,
    };

    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });
      return newAddress;
    }

    // SI YA EXISTE LA DIRECCION ACTUALIZAR
    const updatedAddress = await prisma.userAddress.update({
      where: { userId },
      data: addressToSave,
    });

    return updatedAddress;
  } catch (err) {
    throw new Error("No se pudo grabar la direccion");
  }
}

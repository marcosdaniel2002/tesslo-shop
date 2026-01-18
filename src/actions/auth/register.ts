"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const registerUser = async function (
  name: string,
  email: string,
  password: string,
) {
  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
      },
    });
    return {
      resp: true,
      user: user,
    };
  } catch (error) {
    console.log(error);
    return {
      resp: false,
      message: "No se pudo crear el usuario",
    };
  }
};

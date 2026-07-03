import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const getPaginatedUsers = async () => {
  try {
    const session = await auth();
    if (session?.user.role !== "admin") throw new Error("No autorizado");
    const users = await prisma.user.findMany({
      orderBy: {
        name: "desc",
      },
    });
    return {
      resp: true,
      users,
    };
  } catch (error: any) {
    return {
      resp: false,
      message: error.message,
    };
  }
};

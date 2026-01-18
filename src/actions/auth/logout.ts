"use server";

import { signOut } from "@/auth";

export const logout = async function () {
  await signOut();
};

"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: { estado: boolean; mensaje: string } | undefined,
  formData: FormData,
) {
  try {
    // await sleep(3);
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false,
    }); // PUEDE SER GOOGLE GITHUB ETC
    return {
      estado: true,
      mensaje: "Registro exitoso",
    };
  } catch (err) {
    if ((err as any).type === "CredentialsSignin") {
      return {
        estado: false,
        mensaje:
          "Credenciales incorrectas. Por favor, verifica tu email y contraseña.",
      };
    }

    return {
      estado: false,
      mensaje: "Error desconocido",
    };
  }
}

export async function login(email: string, password: string) {
  try {
    await signIn("credentials", { email, password });
    return {
      resp: true,
    };
  } catch (error) {
    console.log(error);
    return {
      resp: false,
      message: "No se pudo iniciar sesion",
    };
  }
}

export async function authenticateGithub() {
  try {
    const result = await signIn("github", {
      callbackUrl: "/",
      redirect: false,
    });
    if (result) {
      return {
        estado: true,
        mensaje: "Redirigiendo a GitHub...",
        redirectUrl: result, // ¡Aquí está la URL de redirección!
      };
    }
    return {
      estado: false,
      mensaje: "Error con la autenticación de GitHub",
    };
  } catch (err) {
    console.error("Error en autenticación con GitHub:", err);

    if (err instanceof AuthError) {
      return {
        estado: false,
        mensaje: "Error con la autenticación de GitHub",
      };
    }

    return {
      estado: false,
      mensaje: "Error desconocido con GitHub",
    };
  }
}

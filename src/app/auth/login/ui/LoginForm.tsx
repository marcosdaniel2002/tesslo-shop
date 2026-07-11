"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { authenticate, authenticateGithub } from "@/actions/auth/login";
import { IoInformationOutline, IoLogoGithub } from "react-icons/io5";
import { useEffect, useState } from "react";

// SERVER ACTIONS CON VALIDACION DEL LADO DEL SERVIDOR
function LoginForm() {
  const [state, dispatch] = useFormState(authenticate, undefined);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  // Función para GitHub usando signIn del cliente
  const handleGitHubLogin = async () => {
    setIsGitHubLoading(true);

    try {
      const { estado, mensaje, redirectUrl } = await authenticateGithub();
      console.log({ estado, mensaje, redirectUrl });
      if (estado && redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("Error en GitHub login:", error);
    } finally {
      setIsGitHubLoading(false);
    }
  };

  useEffect(() => {
    if (state?.estado) {
      // router.replace("/");
      window.location.replace("/"); // ACTUALIZAR LA PAGINA NO SIEMPRE ES MALO
    }
  }, [state]);

  return (
    <form action={dispatch} className="flex flex-col">
      <label htmlFor="email" className="text-sm text-muted mb-1">
        Correo electrónico
      </label>
      <input
        name="email"
        className="input mb-5"
        type="email"
        defaultValue="marcosdanny14@gmail.com"
        placeholder="marcosdanny14@gmail.com"
      />

      <label htmlFor="password" className="text-sm text-muted mb-1">
        Contraseña
      </label>
      <input
        name="password"
        className="input mb-5"
        type="password"
        placeholder="123456"
      />

      <div
        className="flex items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {!state?.estado && state?.mensaje && (
          <div className="fade-in mb-4 p-4 bg-danger rounded-notion shadow-sm flex items-start gap-3">
            <IoInformationOutline className="h-5 w-5 text-black flex-shrink-0 mt-0.5" />
            <p className="text-sm text-black font-medium">{state?.mensaje}</p>
          </div>
        )}
      </div>

      <LoginButton />

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 h-px bg-divider"></div>
        <div className="px-2 text-muted">O</div>
        <div className="flex-1 h-px bg-divider"></div>
      </div>

      {/* Botón de GitHub */}
      <button
        type="button"
        onClick={handleGitHubLogin}
        disabled={isGitHubLoading}
        className="flex items-center justify-center gap-3 w-full py-2 mb-5 bg-foreground text-background rounded-notion hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <IoLogoGithub className="w-5 h-5" />
        {isGitHubLoading ? "Conectando..." : "Continuar con GitHub"}
      </button>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  );
}

export default LoginForm;

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`${pending ? "btn-disabled" : "btn-primary"}`}
      disabled={pending}
    >
      Ingresar
    </button>
  );
}

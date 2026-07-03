"use client";

import { login } from "@/actions/auth/login";
import { registerUser } from "@/actions/auth/register";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoInformationOutline } from "react-icons/io5";

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

// SERVER ACTION - VALIDACION DEL LADO DEL CLIENTE
function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async function (data: FormInputs) {
    setErrorMessage("");
    const { name, email, password } = data;

    // SERVER ACTION
    const { resp, message } = await registerUser(name, email, password);
    if (!resp) {
      setErrorMessage(message ?? "");
    }

    await login(email.toLocaleLowerCase(), password);
    // window.location.replace("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      <label htmlFor="name">Nombre completo</label>
      <input
        {...register("name", { required: true })}
        className={`px-5 py-2 border bg-gray-200 rounded mb-5 ${errors.name && "border-red-500"}`}
        type="text"
      />

      <label htmlFor="email">Correo electrónico</label>
      <input
        {...register("email", {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        })}
        className={`px-5 py-2 border bg-gray-200 rounded mb-5 ${errors.email && "border-red-500"}`}
        type="email"
      />

      <label htmlFor="password">Contraseña</label>
      <input
        {...register("password", { required: true, minLength: 6 })}
        className={`px-5 py-2 border bg-gray-200 rounded mb-5 ${errors.password && "border-red-500"}`}
        type="password"
      />

      {errorMessage && (
        <div className="fade-in mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <IoInformationOutline className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      <button className="btn-primary">Registrar</button>

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Tengo una cuenta
      </Link>
    </form>
  );
}

export default RegisterForm;

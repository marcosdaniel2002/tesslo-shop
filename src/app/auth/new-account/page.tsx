import Link from "next/link";

export default function page() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className={`text-4xl mb-5`}>Creacion de cuenta</h1>

      <div className="flex flex-col">
        <label htmlFor="nombres">Nombre completo</label>
        <input
          name="nombres"
          className="px-5 py-2 border bg-gray-200 rounded mb-5"
          type="text"
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          name="email"
          className="px-5 py-2 border bg-gray-200 rounded mb-5"
          type="email"
        />

        <label htmlFor="password">Contraseña</label>
        <input
          name="password"
          className="px-5 py-2 border bg-gray-200 rounded mb-5"
          type="password"
        />

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
      </div>
    </div>
  );
}

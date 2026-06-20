import Image from "next/image";
import Link from "next/link";

function PageNotFound() {
  return (
    <div className="flex flex-col-reverse md:flex-row h-[600px] lg:h-[800px] w-full justify-center items-center align-middle">
      {/* TEXTO */}
      <div className="text-center px-5 mx-5">
        <h2 className="antialiased text-9xl">404</h2>
        <p className="font-semibold text-xl">
          Whoops! Lo sentimos mucho, pagina no encontrada.
        </p>
        <Link
          href={"/"}
          className="inline-block mt-4 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
        >
          Ir al inicio
        </Link>
      </div>

      {/* IMAGEN */}
      <div className="px-5 mx-5">
        <Image
          src={"/imgs/starman_750x750.png"}
          alt="Startman"
          className="p-5 sm:p-0"
          width={550}
          height={550}
        />
      </div>
    </div>
  );
}

export default PageNotFound;

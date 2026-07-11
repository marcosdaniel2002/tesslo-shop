import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

function page() {
  return (
    <div className="flex flex-col items-center justify-center h-[800px] px-5 text-center">
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-surface shadow-sm mb-6">
        <IoCartOutline size={44} className="text-secondary" />
      </div>

      <h1 className="text-xl font-semibold text-foreground mb-2">
        Tu carrito está vacío
      </h1>
      <p className="text-secondary mb-6">Aún no agregaste productos.</p>

      <Link href={"/"} className="btn-primary">
        Ir a la tienda
      </Link>
    </div>
  );
}

export default page;

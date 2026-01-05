import Link from "next/link";

function Footer() {
  return (
    <div className="flex w-full justify-center text-xs mb-5">
      <Link href={"/"}>
        <span className="antialiased font-bold">Teslo</span>
        <span>| Shop</span>
        <span> © {new Date().getFullYear()}</span>
      </Link>

      <Link href={"/"} className="mx-3">
        Privacidad & Legal
      </Link>

      <Link href={"/"} className="mx-3">
        Ubicaciones
      </Link>
    </div>
  );
}

export default Footer;

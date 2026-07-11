import Link from "next/link";

function Footer() {
  return (
    <div className="flex w-full justify-center text-xs text-secondary mb-5 pt-8">
      <Link href={"/"}>
        <span className="antialiased font-bold text-foreground">Teslo</span>
        <span>| Shop</span>
        <span> © {new Date().getFullYear()}</span>
      </Link>

      <Link href={"/"} className="mx-3 hover:text-foreground transition-colors">
        Privacidad & Legal
      </Link>

      <Link href={"/"} className="mx-3 hover:text-foreground transition-colors">
        Ubicaciones
      </Link>
    </div>
  );
}

export default Footer;

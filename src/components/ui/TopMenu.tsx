"use client";

import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/store";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoCartOutline, IoMenuOutline, IoSearchOutline } from "react-icons/io5";

function TopMenu() {
  const openMenu = useUIStore((state) => state.openSideMenu);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado para controlar la hidratación
  const [mounted, setMounted] = useState(false);

  // Estado para el comportamiento de auto-ocultar al hacer scroll
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // Estado del buscador animado
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchFormRef = useRef<HTMLFormElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 8);

      if (currentScrollY < 80) {
        setHidden(false);
      } else if (currentScrollY > lastScrollY.current) {
        setHidden(true); // bajando: se oculta
      } else {
        setHidden(false); // subiendo: vuelve a bajar a la vista
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  // Si la URL trae ?query=, mostrar el input abierto con ese texto
  useEffect(() => {
    const urlQuery = searchParams.get("query") ?? "";
    if (urlQuery) {
      setQuery(urlQuery);
      setIsSearchOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchFormRef.current && !searchFormRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsSearchOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    router.push(`/search?query=${encodeURIComponent(trimmed)}`);
  }

  function handleSearchButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isSearchOpen) {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 z-20 flex h-16 px-5 justify-between items-center w-full bg-background transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "shadow-md" : "shadow-sm"}`}
    >
      {/* LOGO */}
      <div>
        <Link href="/">
          <span className="antialiased font-bold text-foreground">Teslo</span>
          <span className="text-secondary"> | Shop</span>
        </Link>
      </div>

      {/* CENTER MENU */}
      <div className="hidden sm:block">
        <Link
          className="m-2 p-2 rounded-notion font-medium transition-all text-foreground hover:text-accent hover:bg-surface"
          href={"/gender/men"}
        >
          Hombres
        </Link>
        <Link
          className="m-2 p-2 rounded-notion font-medium transition-all text-foreground hover:text-accent hover:bg-surface"
          href={"/gender/women"}
        >
          Mujeres
        </Link>
        <Link
          className="m-2 p-2 rounded-notion font-medium transition-all text-foreground hover:text-accent hover:bg-surface"
          href={"/gender/kid"}
        >
          Niños
        </Link>
      </div>

      {/* SEARCH, CART, MENU */}
      <div className="flex items-center gap-2">
        <form ref={searchFormRef} onSubmit={handleSearchSubmit} className="flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            tabIndex={isSearchOpen ? 0 : -1}
            className={`h-10 rounded-notion bg-background text-black text-sm shadow-sm outline-none transition-all duration-300 ease-out focus:shadow-[0_0_0_2px_var(--accent)] ${
              isSearchOpen
                ? "w-40 sm:w-56 opacity-100 px-3 mr-1"
                : "w-0 opacity-0 px-0 mr-0 pointer-events-none"
            }`}
          />
          <button
            type="submit"
            onClick={handleSearchButtonClick}
            className="icon-btn"
            aria-label="Buscar"
          >
            <IoSearchOutline size={20} />
          </button>
        </form>
        <Link
          href={mounted && totalItems > 0 ? "/cart" : "/empty"}
          className="icon-btn relative"
          aria-label="Carrito"
        >
          {mounted && totalItems > 0 && (
            <span className="absolute text-xs px-1.5 rounded-full font-bold -top-1.5 -right-1.5 bg-accent text-black">
              {totalItems}
            </span>
          )}
          <IoCartOutline size={20} />
        </Link>
        <button onClick={openMenu} className="icon-btn" aria-label="Abrir menú">
          <IoMenuOutline size={22} />
        </button>
      </div>
    </nav>
  );
}

export default TopMenu;

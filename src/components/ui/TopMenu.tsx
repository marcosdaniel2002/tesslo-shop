"use client";

import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";

function TopMenu() {
  const openMenu = useUIStore((state) => state.openSideMenu);
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Estado para controlar la hidratación
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      {/* LOGO */}
      <div>
        <Link href="/">
          <span className="antialiased font-bold">Teslo</span>
          <span>| Shop</span>
        </Link>
      </div>

      {/* CENTER MENU */}
      <div className="hidden sm:block">
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/men"}
        >
          Hombres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/women"}
        >
          Mujeres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/kid"}
        >
          Niños
        </Link>
      </div>

      {/* SEARCH, CART, MENU */}
      <div className="flex item-center">
        <Link href={"/search"} className="px-2 flex items-center">
          <IoSearchOutline className="" size={24} />
        </Link>
        <Link
          href={mounted && totalItems > 0 ? "/cart" : "/empty"}
          className="px-2 flex items-center"
        >
          <div className="relative">
            {mounted && totalItems > 0 && (
              <span className="absolute text-xs px-2 rounded-full font-bold -top-2 -right-2 bg-red-600 text-white">
                {totalItems}
              </span>
            )}

            <IoCartOutline className="" size={24} />
          </div>
        </Link>
        <button
          onClick={openMenu}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Menu
        </button>
      </div>
    </nav>
  );
}

export default TopMenu;

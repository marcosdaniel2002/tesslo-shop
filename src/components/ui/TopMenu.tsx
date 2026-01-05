"use client";

import { useUIStore } from "@/store/store";
import Link from "next/link";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";

function TopMenu() {
  const openMenu = useUIStore((state) => state.openSideMenu);
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
          href={"/category/men"}
        >
          Hombres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/category/women"}
        >
          Mujeres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/category/kid"}
        >
          Niños
        </Link>
      </div>

      {/* SEARCH, CART, MENU */}
      <div className="flex item-center">
        <Link href={"/search"} className="px-2 flex items-center">
          <IoSearchOutline className="" size={24} />
        </Link>
        <Link href={"/cart"} className="px-2 flex items-center">
          <div className="relative">
            <span className="absolute text-xs px-2 rounded-full font-bold -top-2 -right-2 bg-red-600 text-white">
              3
            </span>
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

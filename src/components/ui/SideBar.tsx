"use client";

import { logout } from "@/actions/auth/logout";
import { useUIStore } from "@/store/store";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function SideBar() {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const router = useRouter();

  const { data: session } = useSession();

  const isAuthenticated = session?.user;
  const isAdmin = session?.user.role == "admin";

  async function handleLogout() {
    await logout();
    router.replace("/auth/login");
  }

  useEffect(() => {}, [session?.user]);

  return (
    <div>
      {/* BLACKGROUND  */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"></div>
      )}

      {/* BLUR */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        ></div>
      )}

      {/* SIDEMENU */}
      <nav
        className={`fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300 ${
          !isSideMenuOpen && "translate-x-full"
        }`}
      >
        <IoCloseOutline
          size={35}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={closeMenu}
        />

        {/* INPUT */}
        <div className="relative mt-14 mb-4">
          <IoSearchOutline size={25} className="absolute top-3 left-2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-gray-50 rounded pl-10 py-3 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {isAuthenticated && (
          <>
            <Link
              href="/profile"
              onClick={closeMenu}
              className="flex items-center p-4 hover:bg-gray-100 rounded transition-all"
            >
              <IoPersonOutline size={30} />
              <span className="ml-3 text-xl">Perfil</span>
            </Link>
            <Link
              href="/"
              className="flex items-center p-4 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>

            <div className="w-full h-px bg-gray-200 my-5"></div>
          </>
        )}

        {isAuthenticated && isAdmin && (
          <>
            <Link
              href="/"
              className="flex items-center p-4 hover:bg-gray-100 rounded transition-all"
            >
              <IoShirtOutline size={30} />
              <span className="ml-3 text-xl">Productos</span>
            </Link>
            <Link
              href="/"
              className="flex items-center p-4 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>
            <Link
              href="/"
              className="flex items-center p-4 hover:bg-gray-100 rounded transition-all"
            >
              <IoPeopleOutline size={30} />
              <span className="ml-3 text-xl">Usuarios</span>
            </Link>

            <div className="w-full h-px bg-gray-200 my-5"></div>
          </>
        )}

        {!isAuthenticated ? (
          <Link
            onClick={closeMenu}
            href="/auth/login"
            className="flex items-center p-4 hover:bg-gray-100 rounded transition-all"
          >
            {" "}
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl">Ingresar</span>
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center p-4 hover:bg-gray-100 rounded transition-all w-full"
          >
            <IoLogOutOutline size={30} />
            <span className="ml-3 text-xl">Salir</span>
          </button>
        )}
      </nav>
    </div>
  );
}

export default SideBar;

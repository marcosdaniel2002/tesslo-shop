"use client";

import { logout } from "@/actions/auth/logout";
import { useUIStore } from "@/store/store";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  IoCloseOutline,
  IoHomeOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoManOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
  IoWomanOutline,
} from "react-icons/io5";
import type { IconType } from "react-icons";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface NavItem {
  href: string;
  icon: IconType;
  label: string;
}

const generalItems: NavItem[] = [
  { href: "/", icon: IoHomeOutline, label: "Inicio" },
  { href: "/gender/men", icon: IoManOutline, label: "Hombres" },
  { href: "/gender/women", icon: IoWomanOutline, label: "Mujeres" },
  { href: "/gender/kid", icon: IoPeopleOutline, label: "Niños" },
];

const accountItems: NavItem[] = [
  { href: "/profile", icon: IoPersonOutline, label: "Perfil" },
  { href: "/orders", icon: IoTicketOutline, label: "Mis Ordenes" },
];

const adminItems: NavItem[] = [
  { href: "/admin/products", icon: IoShirtOutline, label: "Productos" },
  { href: "/admin/orders", icon: IoTicketOutline, label: "Ordenes" },
  { href: "/admin/users", icon: IoPeopleOutline, label: "Usuarios" },
];

function filterItems(items: NavItem[], query: string) {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter((item) => item.label.toLowerCase().includes(q));
}

function SideBar() {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const router = useRouter();

  const { data: session } = useSession();

  const isAuthenticated = session?.user;
  const isAdmin = session?.user.role == "admin";

  const [query, setQuery] = useState("");

  async function handleLogout() {
    await logout();
    router.replace("/auth/login");
  }

  useEffect(() => {}, [session?.user]);

  const filteredGeneral = useMemo(() => filterItems(generalItems, query), [query]);
  const filteredAccount = useMemo(() => filterItems(accountItems, query), [query]);
  const filteredAdmin = useMemo(() => filterItems(adminItems, query), [query]);

  const hasResults =
    filteredGeneral.length > 0 ||
    (Boolean(isAuthenticated) && filteredAccount.length > 0) ||
    (Boolean(isAuthenticated) && isAdmin && filteredAdmin.length > 0);

  return (
    <div>
      {/* BACKGROUND OVERLAY */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-30 bg-black/30"
        ></div>
      )}

      {/* SIDEMENU */}
      <nav
        className={`fixed flex flex-col right-0 top-0 w-[380px] max-w-full h-screen bg-background z-40 shadow-2xl transform transition-transform duration-300 ease-out ${
          !isSideMenuOpen && "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-lg font-bold text-foreground">Menú</span>
          <button
            onClick={closeMenu}
            className="icon-btn"
            aria-label="Cerrar menú"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* SEARCH */}
          <div className="relative mb-6">
            <IoSearchOutline size={20} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar páginas..."
              className="input !pl-10"
            />
          </div>

          {filteredGeneral.length > 0 && (
            <SideBarSection label="Navegación">
              {filteredGeneral.map((item) => (
                <SideBarItem key={item.href} {...item} onClick={closeMenu} />
              ))}
            </SideBarSection>
          )}

          {isAuthenticated && filteredAccount.length > 0 && (
            <SideBarSection label="Cuenta">
              {filteredAccount.map((item) => (
                <SideBarItem key={item.href} {...item} onClick={closeMenu} />
              ))}
            </SideBarSection>
          )}

          {isAuthenticated && isAdmin && filteredAdmin.length > 0 && (
            <SideBarSection label="Administración">
              {filteredAdmin.map((item) => (
                <SideBarItem key={item.href} {...item} onClick={closeMenu} />
              ))}
            </SideBarSection>
          )}

          {query && !hasResults && (
            <p className="text-sm text-muted text-center mt-8">
              No se encontraron páginas para &quot;{query}&quot;.
            </p>
          )}
        </div>

        {/* FOOTER ACTION */}
        <div className="px-5 py-4">
          {!isAuthenticated ? (
            <Link onClick={closeMenu} href="/auth/login" className="btn-primary flex items-center justify-center gap-2 w-full">
              <IoLogInOutline size={20} />
              Ingresar
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center justify-center gap-2 w-full"
            >
              <IoLogOutOutline size={20} />
              Salir
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

interface SideBarSectionProps {
  label: string;
  children: React.ReactNode;
}

function SideBarSection({ label, children }: SideBarSectionProps) {
  return (
    <div className="mb-6">
      <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">
        {label}
      </p>
      <div className="flex flex-col gap-1">{children}</div>
      <div className="w-full h-px bg-divider mt-6"></div>
    </div>
  );
}

interface SideBarItemProps {
  href: string;
  icon: IconType;
  label: string;
  onClick: () => void;
}

function SideBarItem({ href, icon: Icon, label, onClick }: SideBarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-3 rounded-notion transition-all text-foreground hover:bg-surface hover:text-accent"
    >
      <Icon size={22} />
      <span className="text-base font-medium">{label}</span>
    </Link>
  );
}

export default SideBar;

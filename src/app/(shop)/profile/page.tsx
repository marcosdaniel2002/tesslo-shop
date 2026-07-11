import { auth } from "@/auth";
import Title from "@/components/ui/Title";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  IoMailOutline,
  IoPersonCircleOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";

async function page() {
  const session = await auth();

  if (!session) redirect("/");

  const { user } = session;
  const isAdmin = user.role === "admin";

  return (
    <div className="px-4 sm:px-0 mb-20">
      <Title title="Perfil" />

      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-surface border-2 border-accent rounded-notion shadow-md p-8 flex flex-col items-center text-center">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Foto de perfil"}
                width={112}
                height={112}
                className="rounded-full object-cover w-28 h-28 ring-4 ring-divider"
              />
            ) : (
              <IoPersonCircleOutline className="w-28 h-28 text-muted" />
            )}

            <h2 className="mt-4 text-2xl font-semibold text-foreground">
              {user.name}
            </h2>

            <span
              className={`mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                isAdmin
                  ? "bg-foreground text-background"
                  : "bg-divider text-secondary"
              }`}
            >
              <IoShieldCheckmarkOutline className="w-3.5 h-3.5" />
              {isAdmin ? "Administrador" : "Cliente"}
            </span>

            <div className="w-full h-px bg-divider my-6"></div>

            <div className="w-full flex items-center gap-3 text-left">
              <IoMailOutline className="w-5 h-5 text-muted flex-shrink-0" />
              <div>
                <p className="text-xs text-muted">Correo electrónico</p>
                <p className="text-sm text-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;

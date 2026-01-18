import { auth } from "@/auth";
import Title from "@/components/ui/Title";
import { redirect } from "next/navigation";

async function page() {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <div>
      <Title title="Perfil" />
      {JSON.stringify(session.user)}
      <h3>{session.user.role}</h3>
    </div>
  );
}

export default page;

import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

async function layout({ children }: Props) {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/auth/login");
  }

  return <>{children}</>;
}

export default layout;

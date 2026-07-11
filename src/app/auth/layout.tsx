import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

async function layout({ children }: Props) {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <main className="flex justify-center min-h-screen bg-background">
      <div className="w-full sm:w-[450px] px-10">{children}</div>
    </main>
  );
}

export default layout;

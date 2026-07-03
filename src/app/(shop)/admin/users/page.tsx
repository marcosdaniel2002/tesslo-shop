import { redirect } from "next/navigation";

import Title from "@/components/ui/Title";
import UsersTable from "./ui/UsersTable";
import { getPaginatedUsers } from "@/actions/user/get-paginated-users";

async function page() {
  const resp = await getPaginatedUsers();

  if (!resp || !resp.resp || !resp.users) {
    redirect("/auth/login");
  }

  const { users } = resp;

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />
      </div>
    </>
  );
}

export default page;

"use client";

import { changeUserRole } from "@/actions/user/change-user-role";
import { User } from "@/interfaces/user.interface";

interface Props {
  users: User[];
}

function UsersTable({ users }: Props) {
  return (
    <table className="min-w-full">
      <thead className="bg-gray-200 border-b">
        <tr>
          <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            #ID
          </th>
          <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Email
          </th>
          <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Nombre
          </th>
          <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Role
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user.id}
            className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {user.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {user.email}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {user.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <select
                className="text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name=""
                value={user.role}
                onChange={(e) =>
                  changeUserRole(user.id, e.target.value as "user" | "admin")
                }
                id=""
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UsersTable;

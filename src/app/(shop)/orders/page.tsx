import Title from "@/components/ui/Title";
import Link from "next/link";
import { IoCardOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { getOrdersByUser } from "@/actions/order/get-orders-by-user";
import { redirect } from "next/navigation";

export default async function page() {
  const resp = await getOrdersByUser();

  if (!resp || !resp.data) {
    redirect("/auth/login");
  }

  const { orders } = resp.data;

  return (
    <>
      <Title title="Mis órdenes" />

      <div className="mb-10">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              Aún no tienes órdenes registradas.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-200 border-b">
              <tr>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  #ID
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Nombre completo
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Estado
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Total
                </th>
                <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                  Opciones
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id.split("-").at(-1)}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {order.orderAddress
                      ? `${order.orderAddress.firstName} ${order.orderAddress.lastName}`
                      : "Sin dirección"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.isPaid ? (
                      <div className="flex items-center text-sm text-green-700 font-medium">
                        <IoCheckmarkCircleOutline size={20} />
                        <span className="mx-2">Pagada</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-red-700 font-medium">
                        <IoCardOutline size={20} />
                        <span className="mx-2">No pagada</span>
                      </div>
                    )}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4">
                    <Link
                      href={`/orders/${order.id}`}
                      className="hover:underline text-blue-600"
                    >
                      Ver orden
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

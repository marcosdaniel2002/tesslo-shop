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
            <p className="text-muted text-lg mb-4">
              Aún no tienes órdenes registradas.
            </p>
            <Link href="/" className="btn-dark inline-block">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <table className="min-w-full bg-surface rounded-notion shadow-sm overflow-hidden">
            <thead className="bg-background">
              <tr>
                <th className="text-sm font-medium text-secondary px-6 py-4 text-left">
                  #ID
                </th>
                <th className="text-sm font-medium text-secondary px-6 py-4 text-left">
                  Nombre completo
                </th>
                <th className="text-sm font-medium text-secondary px-6 py-4 text-left">
                  Estado
                </th>
                <th className="text-sm font-medium text-secondary px-6 py-4 text-left">
                  Total
                </th>
                <th className="text-sm font-medium text-secondary px-6 py-4 text-left">
                  Opciones
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors duration-200 hover:bg-background"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {order.id.split("-").at(-1)}
                  </td>
                  <td className="text-sm text-secondary font-light px-6 py-4 whitespace-nowrap">
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
                      <div className="flex items-center text-sm text-dangerText font-medium">
                        <IoCardOutline size={20} />
                        <span className="mx-2">No pagada</span>
                      </div>
                    )}
                  </td>
                  <td className="text-sm text-secondary font-light px-6 py-4 whitespace-nowrap">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="text-sm px-6 py-4">
                    <Link
                      href={`/orders/${order.id}`}
                      className="hover:opacity-80 text-accent font-medium transition-opacity"
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

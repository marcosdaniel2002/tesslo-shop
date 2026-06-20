import Title from "@/components/ui/Title";
import Image from "next/image";
import Link from "next/link";
import { IoCartOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

import { getOrderById } from "@/actions/order/get-order-by-id";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

async function page({ params }: Props) {
  const { id } = params;

  const resp = await getOrderById(id);

  if (!resp || !resp.data) {
    redirect("/");
  }

  const order = resp.data.order;
  const address = order.orderAddress;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <div className="flex items-center justify-between">
          <Title title={`Orden #${id.split("-").at(-1)}`} />
          <Link
            href="/orders"
            className="inline-block px-5 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Ver mis órdenes
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* CARRITO */}
          <div className="flex flex-col mt-8">
            <div
              className={`flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 ${
                order.isPaid ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {order.isPaid ? (
                <IoCheckmarkCircleOutline size={30} />
              ) : (
                <IoCartOutline size={30} />
              )}
              <span className="mx-2">
                {order.isPaid ? "Orden pagada" : "Pendiente de pago"}
              </span>
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
              {order.OrderItem.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={`/products/${item.product?.ProductImage[0]?.url ?? ""}`}
                      width={120}
                      height={120}
                      alt={item.product?.title ?? "Producto"}
                      className="rounded-md object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-lg mb-1">
                        {item.product?.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        Talla: {item.size}
                      </p>
                      <p className="text-xl">
                        ${item.price} x {item.quantity}
                      </p>
                      <p className="font-bold">
                        Subtotal: ${item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RESUMEN */}
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2">Direccion de entrega</h2>

            {address ? (
              <div className="mb-5">
                <p>
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                {address.address2 && <p>{address.address2}</p>}
                <p>{address.city}</p>
                <p>{address.country.name}</p>
                <p>CP {address.postalCode}</p>
                <p>Tel: {address.phone}</p>
              </div>
            ) : (
              <p className="text-gray-500 mb-5">Sin dirección registrada</p>
            )}

            <div className="w-full h-0.5 rounded bg-gray-200 mb-5"></div>

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">{order.itemsInOrder} artículos</span>

              <span>Subtotal</span>
              <span className="text-right">${order.subTotal.toFixed(2)}</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">${order.tax.toFixed(2)}</span>

              <span className="text-2xl mt-5">Total:</span>
              <span className="mt-5 text-2xl text-right">
                ${order.total.toFixed(2)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">
              <div
                className={`flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 ${
                  order.isPaid ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {order.isPaid ? (
                  <IoCheckmarkCircleOutline size={30} />
                ) : (
                  <IoCartOutline size={30} />
                )}
                <span className="mx-2">
                  {order.isPaid ? "Orden pagada" : "Pendiente de pago"}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default page;

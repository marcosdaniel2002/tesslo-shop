import Title from "@/components/ui/Title";
import Image from "next/image";
import Link from "next/link";
import { IoCartOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { redirect } from "next/navigation";

import { getOrderById } from "@/actions/order/get-order-by-id";
import PayPalButton from "@/components/ui/paypal/PayPalButton";

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
          <Link href="/orders" className="btn-dark text-sm">
            Ver mis órdenes
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* CARRITO */}
          <div className="flex flex-col mt-8">
            <div
              className={`flex items-center rounded-notion shadow-sm py-2 px-3.5 text-xs font-bold text-white mb-5 ${
                order.isPaid ? "bg-green-500" : "bg-dangerText"
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
                  className="flex gap-4 p-4 bg-surface rounded-notion shadow-sm transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <Image
                      src={`/products/${item.product?.ProductImage[0]?.url ?? ""}`}
                      width={120}
                      height={120}
                      alt={item.product?.title ?? "Producto"}
                      className="rounded-notion object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-lg text-foreground mb-1">
                        {item.product?.title}
                      </h3>
                      <p className="text-sm text-secondary mb-1">
                        Talla: {item.size}
                      </p>
                      <p className="text-xl text-foreground">
                        ${item.price} x {item.quantity}
                      </p>
                      <p className="font-bold text-foreground">
                        Subtotal: ${item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RESUMEN */}
          <div className="bg-surface rounded-notion shadow-md p-7 h-fit">
            <h2 className="text-2xl mb-2 text-foreground font-semibold">Direccion de entrega</h2>

            {address ? (
              <div className="mb-5 text-secondary">
                <p className="font-semibold text-foreground">
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                {address.address2 && <p>{address.address2}</p>}
                <p>{address.city}</p>
                <p>{address.country.name}</p>
                <p>CP {address.postalCode}</p>
                <p className="text-muted">Tel: {address.phone}</p>
              </div>
            ) : (
              <p className="text-muted mb-5">Sin dirección registrada</p>
            )}

            <div className="w-full h-px bg-divider mb-5"></div>

            <h2 className="text-2xl mb-2 text-foreground font-semibold">Resumen de orden</h2>
            <div className="grid grid-cols-2 gap-y-1 text-secondary">
              <span>No. Productos</span>
              <span className="text-right text-foreground">{order.itemsInOrder} artículos</span>

              <span>Subtotal</span>
              <span className="text-right text-foreground">${order.subTotal.toFixed(2)}</span>

              <span>Impuestos (15%)</span>
              <span className="text-right text-foreground">${order.tax.toFixed(2)}</span>

              <span className="text-2xl font-semibold text-foreground mt-5">Total:</span>
              <span className="mt-5 text-2xl font-semibold text-foreground text-right">
                ${order.total.toFixed(2)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">
              {/* BOTON PAYPAL */}
              {!order.isPaid && (
                <div className="relative z-0">
                  <PayPalButton amount={order.total} orderId={order.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;

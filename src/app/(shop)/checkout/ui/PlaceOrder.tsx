"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAddressStore } from "@/store/address";
import { useCartStore } from "@/store/cart";
import { curencyFormat } from "@/utils/currencyFormat";
import { sleep } from "@/utils/functions";

import { placeOrder } from "@/actions/order/place-order";

function PlaceOrder() {
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const address = useAddressStore((state) => state.address);
  const { getSummaryInformation, cart, clearCart } = useCartStore(
    (state) => state,
  );
  const { total, subtotal, tax, itemsInCart } = getSummaryInformation();

  async function onPlaceOrder() {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      size: item.size,
    }));

    await sleep(2);
    const resp = await placeOrder(productsToOrder, address);
    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message);
      return;
    }

    // SI TODO BIEN
    clearCart();
    router.replace("/orders/" + resp.data?.order.id);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 h-fit w-full max-w-sm shadow-sm">
      {/* Dirección */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3 font-medium">
        Dirección de entrega
      </p>

      <div className="space-y-0.5 text-sm text-gray-700 leading-relaxed mb-8">
        <p className="font-semibold text-gray-900">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>
          {address.postalCode} · {address.city}
        </p>
        <p className="text-gray-400">{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-gray-100 mb-8" />

      {/* Resumen */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium">
        Resumen de orden
      </p>

      <div className="space-y-2 text-sm text-gray-600 mb-6">
        <div className="flex justify-between">
          <span>No. Productos</span>
          <span className="text-gray-900">
            {itemsInCart} articulo{itemsInCart > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-gray-900">{curencyFormat(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Impuestos (15%)</span>
          <span className="text-gray-900">{curencyFormat(tax)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-5 mb-7">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Total
        </span>
        <span className="text-2xl font-semibold tracking-tight text-gray-900">
          {curencyFormat(total)}
        </span>
      </div>
      <p className="text-red-500 text-sm">{errorMessage}</p>
      {/* CTA */}
      <button
        className={`${isPlacingOrder ? "btn-disabled" : "btn-primary"} w-full flex items-center justify-center mt-2 active:scale-[0.98] transition-all duration-150`}
        onClick={onPlaceOrder}
        disabled={isPlacingOrder}
      >
        {isPlacingOrder ? "Colocando orden..." : "Colocar orden"}
      </button>

      {/* Disclaimer */}
      <p className="text-[10px] text-center text-gray-400 mt-4 leading-snug">
        Al continuar, aceptas nuestros{" "}
        <a
          href="#"
          className="underline underline-offset-2 hover:text-gray-600 transition-colors"
        >
          términos
        </a>{" "}
        y{" "}
        <a
          href="#"
          className="underline underline-offset-2 hover:text-gray-600 transition-colors"
        >
          política de privacidad
        </a>
        .
      </p>
    </div>
  );
}

export default PlaceOrder;

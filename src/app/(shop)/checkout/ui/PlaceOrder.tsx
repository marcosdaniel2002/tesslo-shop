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
    <div className="bg-surface rounded-notion p-8 h-fit w-full max-w-sm shadow-md">
      {/* Dirección */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3 font-medium">
        Dirección de entrega
      </p>

      <div className="space-y-0.5 text-sm text-secondary leading-relaxed mb-8">
        <p className="font-semibold text-foreground">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>
          {address.postalCode} · {address.city}
        </p>
        <p className="text-muted">{address.phone}</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-divider mb-8" />

      {/* Resumen */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4 font-medium">
        Resumen de orden
      </p>

      <div className="space-y-2 text-sm text-secondary mb-6">
        <div className="flex justify-between">
          <span>No. Productos</span>
          <span className="text-foreground">
            {itemsInCart} articulo{itemsInCart > 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-foreground">{curencyFormat(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Impuestos (15%)</span>
          <span className="text-foreground">{curencyFormat(tax)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="h-px bg-divider" />
      <div className="flex justify-between items-center pt-5 mb-7">
        <span className="text-sm font-medium text-secondary uppercase tracking-wide">
          Total
        </span>
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          {curencyFormat(total)}
        </span>
      </div>
      {errorMessage && (
        <p className="fade-in bg-danger text-black text-sm rounded-notion shadow-sm px-3 py-2 mb-4">
          {errorMessage}
        </p>
      )}
      {/* CTA */}
      <button
        className={`${isPlacingOrder ? "btn-disabled" : "btn-primary"} w-full flex items-center justify-center mt-2`}
        onClick={onPlaceOrder}
        disabled={isPlacingOrder}
      >
        {isPlacingOrder ? "Colocando orden..." : "Colocar orden"}
      </button>

      {/* Disclaimer */}
      <p className="text-[10px] text-center text-muted mt-4 leading-snug">
        Al continuar, aceptas nuestros{" "}
        <a
          href="#"
          className="underline underline-offset-2 hover:text-accent transition-colors"
        >
          términos
        </a>{" "}
        y{" "}
        <a
          href="#"
          className="underline underline-offset-2 hover:text-accent transition-colors"
        >
          política de privacidad
        </a>
        .
      </p>
    </div>
  );
}

export default PlaceOrder;

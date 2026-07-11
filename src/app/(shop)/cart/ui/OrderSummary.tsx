"use client";

import { useCartStore } from "@/store/cart";
import { curencyFormat } from "@/utils/currencyFormat";

function OrderSummary() {
  const { getSummaryInformation } = useCartStore((state) => state);
  const { total, subtotal, tax, itemsInCart } = getSummaryInformation();

  return (
    <div className="grid grid-cols-2 gap-y-1 text-secondary">
      <span>No. Productos</span>
      <span className="text-right text-foreground">
        {itemsInCart} articulo{itemsInCart > 1 ? "s" : ""}
      </span>

      <span>Subtotal</span>
      <span className="text-right text-foreground">{curencyFormat(subtotal)}</span>

      <span>Impuestos (15%)</span>
      <span className="text-right text-foreground">{curencyFormat(tax)}</span>

      <span className="text-2xl font-semibold text-foreground mt-5">Total:</span>
      <span className="mt-5 text-2xl font-semibold text-foreground text-right">
        {curencyFormat(total)}
      </span>
    </div>
  );
}

export default OrderSummary;

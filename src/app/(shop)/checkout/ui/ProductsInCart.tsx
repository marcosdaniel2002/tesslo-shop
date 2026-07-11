"use client";

import { useCartStore } from "@/store/cart";
import Image from "next/image";

function ProductsInCart() {
  const { cart: productsInCart } = useCartStore((state) => state);
  return (
    <>
      {productsInCart.map((product) => (
        <div
          key={product.slug}
          className="flex gap-4 p-4 bg-surface rounded-notion shadow-sm transition-shadow"
        >
          {/* Imagen del producto */}
          <div className="flex-shrink-0">
            <Image
              src={`/products/${product.image}`}
              width={120}
              height={120}
              alt={product.title}
              className="rounded-notion object-cover"
            />
          </div>

          {/* Información del producto */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-medium text-lg text-foreground mb-1">{product.title}</h3>
              <p className="text-sm text-secondary mb-1">Talla: {product.size}</p>
              <p className="text-xl text-foreground">
                ${product.price} x {product.quantity}
              </p>
              <p className="font-bold text-foreground">
                Subtotal: ${product.price * product.quantity}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ProductsInCart;

"use client";

import QuantitySelector from "@/components/products/QuantitySelector";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { IoTrashOutline } from "react-icons/io5";

function ProductsInCart() {
  const {
    cart: productsInCart,
    updateProductCart,
    removeProductCart,
  } = useCartStore((state) => state);
  return (
    <>
      {productsInCart.map((product) => (
        <div
          key={`${product.slug}-${product.size}`}
          className="flex gap-4 p-4 bg-surface rounded-notion shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Imagen del producto */}
          <div className="flex-shrink-0">
            <Image
              src={`/products/${product.image}`}
              width={120}
              height={120}
              alt={product.title}
              className="rounded-md object-cover"
            />
          </div>

          {/* Información del producto */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link
                className="hover:text-accent transition-colors cursor-pointer"
                href={`/product/${product.slug}`}
              >
                <h3 className="font-medium text-lg text-foreground mb-1">{product.title}</h3>
              </Link>
              <p className="text-sm text-secondary">
                <b>Talla: </b>
                {product.size}
              </p>
              <p className="text-xl text-foreground font-semibold">${product.price}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <QuantitySelector
                quantity={product.quantity}
                key={product.slug}
                onQuantityChange={(value) => updateProductCart(product, value)}
              />

              <button
                onClick={() => removeProductCart(product)}
                className="text-dangerText hover:opacity-80 font-medium flex items-center gap-1 transition-opacity"
              >
                <IoTrashOutline />
                Remover
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ProductsInCart;

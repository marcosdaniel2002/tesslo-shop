"use client";

import QuantitySelector from "@/components/products/QuantitySelector";
import SizeSelector from "@/components/products/SizeSelector";
import { Size } from "@/generated/prisma/enums";
import { Product } from "@/interfaces/product.interfaces";
import { useCartStore } from "@/store/cart";
import { useState } from "react";

interface Props {
  product: Product;
}

function AddToCart({ product }: Props) {
  const addProductToCart = useCartStore((state) => state.addProductToCart);

  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | undefined>();

  const addToCart = function () {
    if (!size) {
      setError("Debe seleccionar una talla.");
      return;
    }

    addProductToCart({
      id: product.id,
      price: product.price,
      quantity: quantity,
      size: size,
      slug: product.slug,
      title: product.title,
      image: product.ProductImage[0].url,
    });
    setError("");
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <>
      {/* SELECTOR DE TALLAS */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChange={setSize}
      />

      {/* SELECTOR DE CANTIDAD */}
      <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />

      {/* BOTON */}
      <button onClick={addToCart} className="btn-primary my-5">
        Agregar al carrito
      </button>
      {error && (
        <p className="fade-in inline-block bg-danger text-black text-sm font-medium rounded-notion shadow-sm px-3 py-2 mb-4">
          {error}
        </p>
      )}
    </>
  );
}

export default AddToCart;

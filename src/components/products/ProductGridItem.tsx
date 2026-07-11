"use client";

import { Product } from "@/interfaces/product.interfaces";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Props {
  product: Product;
}

function ProductGridItem({ product }: Props) {
  const [displayImage, setDisplayImage] = useState(product.ProductImage[0].url);
  return (
    <div className="rounded-notion overflow-hidden fade-in bg-surface shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <Link href={`/product/${product.slug}`}>
        <Image
          src={`/products/${displayImage}`}
          alt={product.title}
          className="w-full object-cover"
          width={500}
          height={500}
          onMouseEnter={() => setDisplayImage(product.ProductImage[1].url)}
          onMouseLeave={() => setDisplayImage(product.ProductImage[0].url)}
        />
      </Link>

      <div className="p-4 flex flex-col ">
        <Link className="text-foreground hover:text-accent transition-colors" href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <span className="font-bold text-foreground">${product.price}</span>
      </div>
    </div>
  );
}

export default ProductGridItem;

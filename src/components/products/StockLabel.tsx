"use client";

import { getStockBySlug } from "@/actions/products/get-stock-by-slug";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

function StockLabel({ slug }: Props) {
  const [stock, setStock] = useState(0);

  useEffect(() => {
    const getStock = async () => {
      const stock = (await getStockBySlug(slug)) ?? 0;
      setStock(stock);
    };
    getStock();
  }, [slug]);
  return (
    <span className="inline-block text-xs font-semibold uppercase tracking-wide text-secondary bg-surface rounded-notion px-2 py-1 shadow-sm">
      Stock: {stock}
    </span>
  );
}

export default StockLabel;

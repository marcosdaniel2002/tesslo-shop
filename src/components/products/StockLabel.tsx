"use client";

import { getStockBySlug } from "@/actions/products/get-stock-by-slug";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

function StockLabel({ slug }: Props) {
  const [stock, setStock] = useState(0);

  useEffect(() => {
    getStock();
  }, []);

  const getStock = async function () {
    const stock = (await getStockBySlug(slug)) ?? 0;
    setStock(stock);
  };
  return <h1 className="antialiased font-bold text-xl">Stock: {stock}</h1>;
}

export default StockLabel;

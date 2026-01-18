export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions/products/product";
import ProductGrid from "@/components/products/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import Title from "@/components/ui/Title";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function page({ searchParams }: Props) {
  const page = searchParams.page ? +searchParams.page : 1;
  const { data, totalPages } = await getPaginatedProductsWithImages({ page });

  if (data.length === 0) redirect("/");

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" />

      <ProductGrid products={data} />

      <Pagination totalPages={totalPages} />
    </>
  );
}

export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions/products/product";
import ProductGrid from "@/components/products/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import Title from "@/components/ui/Title";
import { Category } from "@/seed/seed";
import { notFound } from "next/navigation";

const validGendersArray: Category[] = ["men", "women", "kid", "unisex"];

interface Props {
  params: {
    gender: Category;
  };
  searchParams: {
    page?: string;
  };
}

async function page({ params, searchParams }: Props) {
  const { gender } = params;
  const page = searchParams.page ? +searchParams.page : 1;

  const { data, totalPages } = await getPaginatedProductsWithImages({
    page,
    filters: { gender: gender },
  });

  if (!validGendersArray.includes(gender)) {
    notFound();
  }

  const labels: Record<Category, string> = {
    men: "Hombres",
    women: "Mujeres",
    kid: "Niños",
    unisex: "Todos",
  };

  return (
    <div>
      <Title
        title={`Articulos de ${labels[gender]}`}
        subtitle="Todos los productos"
      />

      <ProductGrid products={data} />

      <Pagination totalPages={totalPages} />
    </div>
  );
}

export default page;

import { getPaginatedProductsWithImages } from "@/actions/products/product";
import ProductGrid from "@/components/products/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import Title from "@/components/ui/Title";
import Link from "next/link";

interface Props {
  searchParams: {
    query?: string;
    page?: string;
  };
}

export default async function page({ searchParams }: Props) {
  const query = searchParams.query?.trim() ?? "";
  const page = searchParams.page ? +searchParams.page : 1;

  const { data, totalPages } = query
    ? await getPaginatedProductsWithImages({ page, filters: { title: query } })
    : { data: [], totalPages: 0 };

  return (
    <div className="px-5">
      <Title
        title="Buscar productos"
        subtitle={query ? `Resultados para "${query}"` : "Escribe algo en el buscador para empezar"}
      />

      {query && data.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted text-lg mb-4">
            No encontramos productos que coincidan con &quot;{query}&quot;.
          </p>
          <Link href="/" className="btn-dark inline-block">
            Ver todos los productos
          </Link>
        </div>
      )}

      {data.length > 0 && (
        <>
          <ProductGrid products={data} />
          <Pagination totalPages={totalPages} />
        </>
      )}
    </div>
  );
}

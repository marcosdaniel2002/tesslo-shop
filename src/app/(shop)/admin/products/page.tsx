import Link from "next/link";

import Title from "@/components/ui/Title";
import { getPaginatedProductsWithImages } from "@/actions/products/product";
import Pagination from "@/components/ui/Pagination";
import ProductImage from "../../product/product-image/ProductImage";

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function page({ searchParams }: Props) {
  const page = searchParams.page ? +searchParams.page : 1;
  const { data, totalPages } = await getPaginatedProductsWithImages({ page });

  return (
    <>
      <Title title="Mantenimiento de productos" />

      <div className="flex justify-end mb-5">
        <Link className="btn-primary" href="/admin/product/new">
          Nuevo Producto
        </Link>
      </div>

      <div className="mb-10">
        {data.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">
              Aún no tienes productos registrados.
            </p>
          </div>
        ) : (
          <>
            <table className="min-w-full">
              <thead className="bg-gray-200 border-b">
                <tr>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Imagen
                  </th>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Titulo
                  </th>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Precio
                  </th>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Género
                  </th>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Stock
                  </th>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                    Sizes
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((product) => (
                  <tr
                    key={product.id}
                    className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/product/${product.slug}`}>
                        <ProductImage
                          src={product.ProductImage[0]?.url ?? ''}
                          alt={product.title}
                          width={50}
                          height={50}
                        />
                      </Link>
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/admin/product/${product.slug}`}
                        className="hover:underline text-blue-600"
                      >
                        {product.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {product.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.inStock}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {product.sizes.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination totalPages={totalPages} />
          </>
        )}
      </div>
    </>
  );
}

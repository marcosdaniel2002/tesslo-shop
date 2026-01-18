export const revalidate = 10080; // 7 dias

import ProductSlide from "@/components/products/slideshow/ProductSlide";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/products/get-product-by-slug";
import StockLabel from "@/components/products/StockLabel";
import { Metadata } from "next";
import AddToCart from "./ui/AddToCart";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const product = await getProductBySlug(slug);
  return {
    title: `${product?.title}`,
    description: `${product?.description}`,
  };
}

async function page({ params }: Props) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mt-5 mb-20 grid grid-cols-3 gap-3">
      {/* SLIDESHOW */}
      <div className="col-span-3 md:col-span-2">
        <ProductSlide
          title={product.title}
          images={product.ProductImage.map((obj) => obj.url)}
        />
      </div>

      {/* DETALLES */}
      <div className="col-span-3 md:col-span-1 px-5">
        <StockLabel slug={product.slug} />
        <h1 className="antialiased font-bold text-xl">{product.title}</h1>
        <p className="text-lg mb-5">${product.price}</p>

        <AddToCart product={product} />

        <h3 className="font-bold text-lg">Descripcion</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}

export default page;

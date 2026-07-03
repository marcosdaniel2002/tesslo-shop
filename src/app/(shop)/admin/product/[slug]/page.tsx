import { getProductBySlug } from "@/actions/products/get-product-by-slug";
import Title from "@/components/ui/Title";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";
import { getCategories } from "@/actions/category/get-categories";

interface Props {
  params: {
    slug: string;
  };
}

async function page({ params }: Props) {
  const { slug } = params;

  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
  ]);

  if (!product && slug !== "new") redirect("/admin/products");

  const title = slug == "new" ? "Nuevo producto" : product?.title || "";

  return (
    <>
      <Title title={title} />

      <ProductForm product={product} categories={categories.data} />
    </>
  );
}

export default page;

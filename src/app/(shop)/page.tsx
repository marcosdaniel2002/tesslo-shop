import ProductGrid from "@/components/products/ProductGrid";
import Title from "@/components/ui/Title";
import { initialData } from "@/seed/seed";

const products = initialData.products;

export default function page() {
  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" />

      <ProductGrid products={products} />
    </>
  );
}

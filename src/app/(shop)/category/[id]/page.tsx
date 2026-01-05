import ProductGrid from "@/components/products/ProductGrid";
import Title from "@/components/ui/Title";
import { initialData, Category } from "@/seed/seed";
import { notFound } from "next/navigation";

const validGendersArray: Category[] = ["men", "women", "kid", "unisex"];

interface Props {
  params: {
    id: Category;
  };
}

function page({ params }: Props) {
  const { id } = params;

  if (!validGendersArray.includes(id)) {
    notFound();
  }

  const products = initialData.products.filter(
    (product) => product.gender === id
  );

  const labels: Record<Category, string> = {
    men: "Hombres",
    women: "Mujeres",
    kid: "Niños",
    unisex: "Todos",
  };

  return (
    <div>
      <Title
        title={`Articulos de ${labels[id]}`}
        subtitle="Todos los productos"
      />

      <ProductGrid products={products} />
    </div>
  );
}

export default page;

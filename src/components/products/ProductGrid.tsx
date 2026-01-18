// import { Product } from "@/interfaces/product.interfaces";
import ProductGridItem from "./ProductGridItem";
import { Product } from "@/interfaces/product.interfaces";

interface Props {
  products: Product[];
}

function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10">
      {products.map((product) => (
        <ProductGridItem key={product.slug} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;

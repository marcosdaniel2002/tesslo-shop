import ProductSlide from "@/components/products/slideshow/ProductSlide";
import QuantitySelector from "@/components/products/QuantitySelector";
import SizeSelector from "@/components/products/SizeSelector";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string;
  };
}

function page({ params }: Props) {
  const { slug } = params;
  const product = initialData.products.find((product) => product.slug === slug);
  if (!product) notFound();

  return (
    <div className="mt-5 mb-20 grid grid-cols-3 gap-3">
      {/* SLIDESHOW */}
      <div className="col-span-3 md:col-span-2">
        <ProductSlide title={product.title} images={product.images} />
      </div>

      {/* DETALLES */}
      <div className="col-span-3 md:col-span-1 px-5">
        <h1 className="antialiased font-bold text-xl">{product.title}</h1>
        <p className="text-lg mb-5">${product.price}</p>

        {/* SELECTOR DE TALLAS */}
        <SizeSelector
          selectedSize={product.sizes[0]}
          availableSizes={product.sizes}
        />

        {/* SELECTOR DE CANTIDAD */}
        <QuantitySelector quantity={1} />

        {/* BOTON */}
        <button className="btn-primary my-5">Agregarr al carrito</button>

        <h3 className="font-bold text-lg">Descripcion</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}

export default page;

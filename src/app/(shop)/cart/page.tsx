import EmptyCart from "@/components/cart/EmptyCart";
import QuantitySelector from "@/components/products/QuantitySelector";
import Title from "@/components/ui/Title";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import Link from "next/link";
import { IoTrashOutline } from "react-icons/io5";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

function page() {
  if (productsInCart.length === 0) return <EmptyCart />;
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Carrito" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* CARRITO */}
          <div className="flex flex-col mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Carrito de compras</h2>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 underline text-sm"
              >
                Continuar comprando →
              </Link>
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
              {productsInCart.map((product) => (
                <div
                  key={product.slug}
                  className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg transition-shadow"
                >
                  {/* Imagen del producto */}
                  <div className="flex-shrink-0">
                    <Image
                      src={`/products/${product.images[0]}`}
                      width={120}
                      height={120}
                      alt={product.title}
                      className="rounded-md object-cover"
                    />
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-lg mb-1">
                        {product.title}
                      </h3>
                      <p className="text-xl">${product.price}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <QuantitySelector quantity={3} key={product.slug} />

                      <button className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors">
                        <IoTrashOutline />
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHECKOUT */}
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">3 articulos</span>

              <span>Subtotal</span>
              <span className="text-right">$100</span>

              <span className="text-2xl mt-5">Total:</span>
              <span className="mt-5 text-2xl text-right">$100</span>
            </div>

            <div className="mt-5 mb-2 w-full">
              <Link
                className="btn-primary flex items-center justify-center"
                href="/checkout/address"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;

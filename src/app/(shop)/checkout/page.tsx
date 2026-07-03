import Title from "@/components/ui/Title";
import { initialData } from "@/seed/seed";
import Link from "next/link";
import ProductsInCart from "./ui/ProductsInCart";
import PlaceOrder from "./ui/PlaceOrder";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];

function page() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Verificar orden" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* CARRITO */}
          <div className="flex flex-col mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Carrito de compras</h2>
              <Link
                href="/cart"
                className="text-blue-600 hover:text-blue-700 underline text-sm"
              >
                Editar carrito →
              </Link>
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
              <ProductsInCart />
            </div>

            {/* Mensaje si el carrito está vacío */}
            {productsInCart.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  Tu carrito está vacío
                </p>
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Ver productos
                </Link>
              </div>
            )}
          </div>

          {/* CHECKOUT */}
          <PlaceOrder />
        </div>
      </div>
    </div>
  );
}

export default page;

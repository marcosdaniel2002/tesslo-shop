import Title from "@/components/ui/Title";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import Link from "next/link";

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
                      <p className="text-xl">${product.price} x 3</p>
                      <p className="font-bold">Subtotal: $150</p>
                    </div>
                  </div>
                </div>
              ))}
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
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2">Direccion de entrega</h2>

            <div className="mb-5">
              <p>Marcos Teran</p>
              <p>Av. Siempre viva 123</p>
              <p>Col. Centro</p>
              <p>Alcaldia Cuahtemoc</p>
              <p>Ciudad de Mexico</p>
              <p>CP 121212</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-5"></div>

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
              {/* DISCLAIMER */}
              <span className="text-xs">
                Al hacer clic en {'"'}Colocar orden{'"'}, aceptas nuestros
                <a href="#" className="underline">
                  terminos y condiciones
                </a>
                y
                <a href="#" className="underline">
                  politica de privacidad
                </a>
              </span>
              <Link
                className="btn-primary flex items-center justify-center mt-2"
                href="/orders/123"
              >
                Colocar orden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;

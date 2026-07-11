import Title from "@/components/ui/Title";
import Link from "next/link";
import ProductsInCart from "./ui/ProductsInCart";
import OrderSummary from "./ui/OrderSummary";

function page() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Carrito" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* CARRITO */}
          <div className="flex flex-col mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Carrito de compras</h2>
              <Link href="/" className="btn-dark text-sm">
                Continuar comprando →
              </Link>
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
              <ProductsInCart />
            </div>
          </div>

          {/* CHECKOUT */}
          <div className="bg-surface rounded-notion shadow-md p-7 h-fit">
            <h2 className="text-2xl mb-2 text-foreground font-semibold">Resumen de orden</h2>
            <OrderSummary />

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

import { CartProduct } from "@/interfaces/product.interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  getTotalItems: () => number;
  getSummaryInformation: () => {
    subtotal: number;
    tax: number;
    total: number;
    itemsInCart: number;
  };

  addProductToCart: (product: CartProduct) => void;
  updateProductCart: (product: CartProduct, quantity: number) => void;
  removeProductCart: (product: CartProduct) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      // METHODS
      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        const productInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size,
        );

        if (!productInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // INCREMENTAR LA CANTIDAD POR QUE YA EXISTE
        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }
          return item;
        });

        set({ cart: updatedCartProducts });
      },

      getTotalItems: () => {
        const { cart } = get();
        const total = cart.reduce(
          (prev, current) => current.quantity + prev,
          0,
        );
        return total;
      },

      getSummaryInformation: () => {
        const { cart } = get();

        const subtotal = cart.reduce((subTotal, product) => {
          return product.quantity * product.price + subTotal;
        }, 0);

        const tax = subtotal * 0.15;
        const total = subtotal + tax;
        const itemsInCart = cart.reduce(
          (prev, current) => current.quantity + prev,
          0,
        );
        return { subtotal, tax, total, itemsInCart };
      },

      updateProductCart: (product: CartProduct, quantity: number) => {
        const { cart } = get();

        const updatedCartProducts = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: quantity };
          }
          return item;
        });

        set({ cart: updatedCartProducts });
      },

      removeProductCart: (product: CartProduct) => {
        const { cart } = get();

        const updatedCartProducts = cart.filter((item) => {
          if (item.id !== product.id || item.size !== product.size) {
            return item;
          }
        });

        set({ cart: updatedCartProducts });
      },

      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: "shopping-cart",
    },
  ),
);

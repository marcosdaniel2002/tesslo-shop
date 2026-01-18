import {
  Gender,
  ProductImage,
  Product as ProductPrisma,
  Size,
} from "@/generated/prisma/client";
import { BaseFilters } from "./global.interface";

export type ValidSizes = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type ValidTypes = "shirts" | "pants" | "hoodies" | "hats";

export type Product = ProductPrisma & {
  ProductImage: ProductImage[];
};

export interface ProductFilters extends BaseFilters {
  categoryId?: string;
  gender?: Gender;
  minPrice?: number;
  maxPrice?: number;
  title?: string;
  description?: string;
  sizes?: Size[];
  tags?: string[];
  inStock?: boolean;
  // Puedes agregar más filtros específicos
}

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size: Size;
  image: string;
}

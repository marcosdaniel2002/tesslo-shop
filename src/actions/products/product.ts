"use server";

import {
  PaginatedResponse,
  PaginationOptions,
} from "@/interfaces/global.interface";
import { Product, ProductFilters } from "@/interfaces/product.interfaces";
import prisma from "@/lib/prisma";

export const getPaginatedProductsWithImages = async function ({
  page = 1,
  take = 12,
  filters = {},
}: PaginationOptions<ProductFilters>): Promise<PaginatedResponse<Product>> {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;
  try {
    // Construir condiciones WHERE dinámicamente
    const whereConditions: any = {};

    // Filtrar por categoría
    if (filters.categoryId) {
      whereConditions.categoryId = filters.categoryId;
    }

    // Filtrar por género
    if (filters.gender) {
      whereConditions.gender = filters.gender;
    }

    // Filtrar por precio
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      whereConditions.price = {};
      if (filters.minPrice !== undefined) {
        whereConditions.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        whereConditions.price.lte = filters.maxPrice;
      }
    }

    // Filtrar por título (búsqueda parcial)
    if (filters.title) {
      whereConditions.title = {
        contains: filters.title,
        mode: "insensitive", // Para búsqueda case-insensitive
      };
    }

    // Filtrar por descripción (búsqueda parcial)
    if (filters.description) {
      whereConditions.description = {
        contains: filters.description,
        mode: "insensitive",
      };
    }

    // Filtrar por tallas
    if (filters.sizes && filters.sizes.length > 0) {
      whereConditions.sizes = {
        hasSome: filters.sizes, // Para arrays en Prisma
      };
    }

    // Filtrar por tags
    if (filters.tags && filters.tags.length > 0) {
      whereConditions.tags = {
        hasSome: filters.tags,
      };
    }

    // Filtrar por stock disponible
    if (filters.inStock !== undefined) {
      if (filters.inStock) {
        whereConditions.inStock = {
          gt: 0, // Mayor que 0
        };
      } else {
        whereConditions.inStock = {
          equals: 0, // Igual a 0
        };
      }
    }

    // OBTENER LOS PRODUCTOS CON FILTROS
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      where: whereConditions,
      include: {
        ProductImage: {
          take: 2,
        },
      },
    });

    // OBTENER EL TOTAL DE PAGINAS
    const totalCount = await prisma.product.count({ where: whereConditions });
    const totalPages = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages: totalPages,
      data: products,
    };
  } catch (e) {
    throw new Error(`No se pudo cargar los productos: ${e}`);
  }
};

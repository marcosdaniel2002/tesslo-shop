// [1, 2, 3, ..., 48, 49, 50] PAGINAS

export const generatePaginationNumbers = function (
  currentPage: number,
  totalPages: number
): (number | string)[] {
  // SI EL NUMERO DE PAGINAS ES 7 O MENOS
  // MOSTRAR TODAS LAS PAGINAS
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // SI LA PAGINA ACTUAL ESTA ENTRE LAS PRIMERAS 3 PAGINAS
  // MOSTRAR PRIMERAS 3, ... Y LAS ULTIMAS 2
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // SI LA PAGINA ACTUAL ESTA ENTRE LAS ULTIMAS 3 PAGINAS
  // MOSTRAR PRIMERAS 2, ... Y LAS ULTIMAS 3
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // SI LA PAGINA ACTUAL ESTA EN EL MEDIO
  // MOSTRAR PRIMERA PAGINA, ..., PAGINA ACTUAL - 1, PAGINA ACTUAL, PAGINA ACTUAL + 1, ..., ULTIMA PAGINA
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export type BaseFilters = Record<string, any>;

export interface PaginationOptions<T extends BaseFilters> {
  page?: number;
  take?: number;
  filters?: T;
}

export interface PaginatedResponse<T> {
  currentPage: number;
  totalPages: number;
  data: T[];
}

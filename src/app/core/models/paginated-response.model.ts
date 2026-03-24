export interface Pagination {
  total: number;
  limit: number;
  page: number;
  totalPages?: number;
  nextCursor?: number | null;
  // Nuevos campos del backend
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

/**
 * Pagination utilities
 */

export interface PaginationOptions {
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginationResult<T> {
  paginatedItems: T[];
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

export const paginate = <T>(
  items: T[],
  options: PaginationOptions
): PaginationResult<T> => {
  const { currentPage, itemsPerPage } = options;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, items.length);
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    paginatedItems,
    totalPages: Math.max(1, totalPages),
    startIndex: items.length === 0 ? 0 : startIndex + 1,
    endIndex,
  };
};


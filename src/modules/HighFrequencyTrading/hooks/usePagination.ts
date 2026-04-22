// hooks/usePagination.ts
import { useMemo } from 'react';

export const DOTS = '...';

export function usePagination(totalItems: number, pageSize: number, currentPage: number) {
  return useMemo(() => {
    const totalPages = Math.ceil(totalItems / pageSize);

    // If we have 7 or fewer pages, just show them all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 1: No left dots, but right dots are needed (e.g., 1 2 3 4 5 ... 10)
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 5;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, totalPages];
    }

    // Case 2: Left dots needed, no right dots (e.g., 1 ... 6 7 8 9 10)
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 5;
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + 1 + i);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Case 3: Both dots needed (e.g., 1 ... 4 5 6 ... 10)
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from({ length: 3 }, (_, i) => leftSiblingIndex + i);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return [];
  }, [totalItems, pageSize, currentPage]);
}
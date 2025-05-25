/**
 * PaymentPagination Component
 * 
 * A modern pagination component for payment tables with proper navigation,
 * page size selection, and accessibility features.
 */

import React, { memo, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaginationMeta } from '@/lib/types/payment';
import { cn } from '@/lib/utils';

// Props interface
interface PaymentPaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  isLoading?: boolean;
  className?: string;
}

// Page size options
const pageSizeOptions = [
  { value: '10', label: '10 per page' },
  { value: '25', label: '25 per page' },
  { value: '50', label: '50 per page' },
  { value: '100', label: '100 per page' },
];

// Generate page numbers for pagination
const generatePageNumbers = (currentPage: number, totalPages: number) => {
  const pages: (number | 'ellipsis')[] = [];
  const maxVisiblePages = 7;

  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage > 4) {
      pages.push('ellipsis');
    }

    // Show pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push('ellipsis');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }

  return pages;
};

// Page button component
interface PageButtonProps {
  page: number | 'ellipsis';
  currentPage: number;
  onClick: (page: number) => void;
  disabled?: boolean;
}

const PageButton = memo<PageButtonProps>(({ page, currentPage, onClick, disabled }) => {
  if (page === 'ellipsis') {
    return (
      <Button variant="ghost" size="sm" disabled className="w-9 h-9">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    );
  }

  const isActive = page === currentPage;

  return (
    <Button
      variant={isActive ? 'default' : 'ghost'}
      size="sm"
      onClick={() => onClick(page)}
      disabled={disabled}
      className={cn(
        'w-9 h-9',
        isActive && 'bg-primary text-primary-foreground'
      )}
    >
      {page}
    </Button>
  );
});

PageButton.displayName = 'PageButton';

// Main PaymentPagination Component
export const PaymentPagination = memo<PaymentPaginationProps>(({
  pagination,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  className
}) => {
  const { page, limit, total, totalPages } = pagination;

  // Calculate display range
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Handle page navigation
  const handleFirstPage = useCallback(() => {
    if (page > 1) onPageChange(1);
  }, [page, onPageChange]);

  const handlePreviousPage = useCallback(() => {
    if (page > 1) onPageChange(page - 1);
  }, [page, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) onPageChange(page + 1);
  }, [page, totalPages, onPageChange]);

  const handleLastPage = useCallback(() => {
    if (page < totalPages) onPageChange(totalPages);
  }, [page, totalPages, onPageChange]);

  const handlePageSizeChange = useCallback((value: string) => {
    const newPageSize = parseInt(value);
    onPageSizeChange?.(newPageSize);
    // Reset to first page when changing page size
    onPageChange(1);
  }, [onPageChange, onPageSizeChange]);

  // Don't render if no data
  if (total === 0) {
    return null;
  }

  const pageNumbers = generatePageNumbers(page, totalPages);

  return (
    <div className={cn(
      'flex flex-col sm:flex-row items-center justify-between gap-4 px-2',
      className
    )}>
      {/* Results info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of{' '}
          {total.toLocaleString()} results
        </span>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Page size selector */}
        {onPageSizeChange && (
          <Select
            value={limit.toString()}
            onValueChange={handlePageSizeChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          {/* First page */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFirstPage}
            disabled={page <= 1 || isLoading}
            className="w-9 h-9"
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous page */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousPage}
            disabled={page <= 1 || isLoading}
            className="w-9 h-9"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNum, index) => (
              <PageButton
                key={`${pageNum}-${index}`}
                page={pageNum}
                currentPage={page}
                onClick={onPageChange}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Next page */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={page >= totalPages || isLoading}
            className="w-9 h-9"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLastPage}
            disabled={page >= totalPages || isLoading}
            className="w-9 h-9"
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

PaymentPagination.displayName = 'PaymentPagination';

export default PaymentPagination;

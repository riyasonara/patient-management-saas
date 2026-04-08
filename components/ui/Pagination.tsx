import React from "react";
import { cn } from "@/lib/utils";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className={cn("flex flex-wrap items-center justify-center gap-1.5", className)}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-softer"
        aria-label="Previous page"
      >
        <IconChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            "flex h-9 min-w-9 px-2 items-center justify-center rounded-lg text-sm font-semibold transition-all shadow-softer",
            currentPage === page
              ? "bg-brand-600 border border-brand-600 text-white shadow-soft"
              : "border border-border bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary"
          )}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-softer"
        aria-label="Next page"
      >
        <IconChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}

import React from "react";
import { cn } from "@/lib/utils";

/* ── Spinner ─────────────────────────────────────────────── */

export function Spinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin",
          sizeMap[size]
        )}
      />
    </div>
  );
}

/* ── Page-level loader ───────────────────────────────────── */

export function PageLoader() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Spinner size="lg" />
    </div>
  );
}

/* ── Skeleton block ──────────────────────────────────────── */

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} {...props} />;
}

/* ── Skeleton row for tables ─────────────────────────────── */

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {/* Header */}
      <div className="bg-surface-hover/50 px-5 py-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1 rounded" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-4 px-5 py-4 border-t border-border"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-4 flex-1 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Stat card skeleton ──────────────────────────────────── */

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 space-y-3">
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="h-8 w-16 rounded" />
      <Skeleton className="h-3 w-32 rounded" />
    </div>
  );
}

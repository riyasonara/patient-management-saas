import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export default function Card({ children, className, glass }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border transition-all duration-300 shadow-soft hover:shadow-card-hover bg-surface",
        glass && "glass",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-6 pb-4 flex items-center justify-between border-b border-border/50", className)}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-lg font-semibold text-text-primary tracking-tight", className)}>
      {children}
    </h3>
  );
}

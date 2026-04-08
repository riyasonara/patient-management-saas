import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "brand" | "male" | "female" | "other";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-surface-hover text-text-secondary border border-border",
  success: "bg-success-muted text-success border border-success/20",
  warning: "bg-warning-muted text-warning border border-warning/20",
  danger: "bg-danger-muted text-danger border border-danger/20",
  info: "bg-info-muted text-info border border-info/20",
  brand: "bg-brand-50 text-brand-600 border border-brand-200",
  male: "bg-info-muted text-info border border-info/20",
  female: "bg-pink-50 text-pink-600 border border-pink-200",
  other: "bg-purple-50 text-purple-600 border border-purple-200",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function genderBadgeVariant(
  gender: string
): BadgeVariant {
  switch (gender.toLowerCase()) {
    case "male":
      return "male";
    case "female":
      return "female";
    default:
      return "other";
  }
}

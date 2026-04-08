"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { type UseFormRegisterReturn } from "react-hook-form";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  registration?: UseFormRegisterReturn;
}

export default function FormTextarea({
  label,
  error,
  registration,
  id,
  className,
  ...props
}: FormTextareaProps) {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-text-primary"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        className={cn(
          "w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted shadow-softer",
          "transition-all duration-200 focus-ring resize-y",
          error
            ? "border-danger focus:border-danger"
            : "border-border hover:border-brand-300 focus:border-brand-500",
          className
        )}
        {...registration}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-danger mt-1">{error}</p>
      )}
    </div>
  );
}

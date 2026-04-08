"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { type UseFormRegisterReturn } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Option[];
  placeholder?: string;
  registration?: UseFormRegisterReturn;
}

export default function FormSelect({
  label,
  error,
  options,
  placeholder = "Select an option",
  registration,
  id,
  className,
  ...props
}: FormSelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-text-primary"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={cn(
          "w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text-primary shadow-softer",
          "transition-all duration-200 focus-ring appearance-none cursor-pointer",
          error
            ? "border-danger focus:border-danger"
            : "border-border hover:border-brand-300 focus:border-brand-500",
          className
        )}
        {...registration}
        {...props}
      >
        <option value="" disabled className="text-text-muted">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs font-medium text-danger mt-1">{error}</p>
      )}
    </div>
  );
}

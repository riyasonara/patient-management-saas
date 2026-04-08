"use client";

import React, { useState, useEffect } from "react";
import { IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync internal state with external value if it changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localValue, onChange, value]);

  return (
    <div className={cn("relative group", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <IconSearch className="h-4 w-4 text-text-muted group-focus-within:text-brand-500 transition-colors" />
      </div>
      <input
        type="text"
        className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted shadow-softer transition-all duration-200 focus-ring hover:border-brand-300 focus:border-brand-500"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    </div>
  );
}

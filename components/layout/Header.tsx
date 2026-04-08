"use client";

import React from "react";
import { IconMenu2, IconBell, IconSearch } from "@tabler/icons-react";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-surface/80 backdrop-blur-md px-4 lg:px-8 shadow-softer">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden rounded-xl p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
        aria-label="Toggle menu"
      >
        <IconMenu2 className="h-5 w-5" />
      </button>

      {/* Spacer / Search (Placeholder) */}
      <div className="flex-1 flex items-center">
        <div className="hidden md:flex items-center gap-2 text-text-muted bg-background px-3 py-1.5 rounded-lg border border-border">
          <IconSearch className="w-4 h-4" />
          <span className="text-xs font-medium">Search patients (⌘+K)</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-xl transition-colors">
          <IconBell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-surface"></span>
        </button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-500 to-info-light flex items-center justify-center text-sm font-bold text-white shadow-soft ring-2 ring-white cursor-pointer hover:scale-105 transition-transform">
          DR
        </div>
      </div>
    </header>
  );
}

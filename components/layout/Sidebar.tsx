"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconHeartbeat, IconLayoutDashboard, IconUsers, IconUserPlus, IconX } from "@tabler/icons-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/patients", label: "Patients", icon: IconUsers },
  { href: "/patients/create", label: "Add Patient", icon: IconUserPlus },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/patients") return pathname === "/patients";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden animate-backdrop"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-sidebar-bg border-r border-sidebar-border shadow-soft",
          "transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0 animate-slide-in-left" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-sidebar-border bg-sidebar-bg">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 shadow-md shadow-brand-500/20 transition-transform group-hover:scale-105">
              <IconHeartbeat className="h-5 w-5 text-white" stroke={2.5} />
            </div>
            <span className="text-xl font-bold text-text-primary tracking-tight">
              PatientMS
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200",
                isActive(href)
                  ? "bg-sidebar-active text-sidebar-active-text shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-sidebar-hover hover:-translate-y-px"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" stroke={isActive(href) ? 2.5 : 2} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-sidebar-border bg-background/50">
          <p className="text-xs font-medium text-text-muted text-center">
            © 2026 PatientMS
          </p>
        </div>
      </aside>
    </>
  );
}

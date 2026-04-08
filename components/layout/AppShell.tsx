"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Soft background glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-300/20 blur-[120px] rounded-full pointer-events-none" />
        
        <Header onMenuToggle={() => setSidebarOpen((o) => !o)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 z-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

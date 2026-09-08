"use client";

import { useState } from "react";
import { DashboardSidebar } from "./dashboard-sidebar.component";
import { DashboardHeader } from "./dashboard-header.component";
import { MobileSidebarDrawer } from "./mobile-sidebar-drawer.component";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:flex lg:flex-col lg:shrink-0">
        <DashboardSidebar
          isCollapsed={sidebarCollapsed}
          onCollapseToggle={() => setSidebarCollapsed((v) => !v)}
        />
      </div>

      {/* Mobile drawer */}
      <MobileSidebarDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          onMobileMenuOpen={() => setMobileDrawerOpen(true)}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

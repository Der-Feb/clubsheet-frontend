"use client";

import { useState } from "react";
import { DashboardSidebar } from "./dashboard-sidebar.component";
import { DashboardHeader } from "./dashboard-header.component";
import { MobileSidebarDrawer } from "./mobile-sidebar-drawer.component";

interface DashboardShellProps {
  children: React.ReactNode;
  initialClubId?: string;
}

export function DashboardShell({ children, initialClubId }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:flex lg:flex-col lg:shrink-0">
        <DashboardSidebar
          isCollapsed={sidebarCollapsed}
          onCollapseToggle={() => setSidebarCollapsed((v) => !v)}
          initialClubId={initialClubId}
        />
      </div>

      {/* Mobile drawer */}
      <MobileSidebarDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        initialClubId={initialClubId}
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

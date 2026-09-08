"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentClub } from "@/hooks/use-current-club.hook";
import { MOCK_USER } from "@/mocks/user.mock";
import { ClubSwitcher } from "./club-switcher.component";
import { UserMenu } from "./user-menu.component";
import { DashboardNav } from "./navigation/dashboard-nav.component";

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onCollapseToggle: () => void;
}

export function DashboardSidebar({
  isCollapsed,
  onCollapseToggle,
}: DashboardSidebarProps) {
  const { activeClub, clubs, setActiveClub } = useCurrentClub();

  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        "flex flex-col h-full border-r border-border bg-card text-card-foreground transition-[width] duration-200 ease-in-out overflow-hidden",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Top: club switcher + collapse toggle */}
      <div
        className={cn(
          "border-b border-border transition-all",
          isCollapsed
            ? "flex flex-col items-center gap-2 px-2 py-3"
            : "flex items-center gap-1 px-2 py-3"
        )}
      >
        <div
          className={cn(
            isCollapsed ? "w-full flex justify-center" : "flex-1 min-w-0"
          )}
        >
          <ClubSwitcher
            activeClub={activeClub}
            clubs={clubs}
            onSelect={setActiveClub}
            isCollapsed={isCollapsed}
          />
        </div>

        <button
          type="button"
          onClick={onCollapseToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <DashboardNav isCollapsed={isCollapsed} />
      </div>

      {/* Bottom: user menu */}
      <div className="border-t border-border px-2 py-3">
        <UserMenu user={MOCK_USER} isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}

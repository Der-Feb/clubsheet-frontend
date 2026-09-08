"use client";

import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { NotificationsDropdown } from "./notifications-dropdown.component";
import { ThemeToggle } from "@/components/theme-toggle.component";

interface DashboardHeaderProps {
  onMobileMenuOpen: () => void;
  pageTitle?: string;
}

const ROUTE_TITLES: Record<string, { title: string; section?: string }> = {
  "/dashboard": { title: "Overview", section: "ClubSheet" },
  "/dashboard/players": { title: "Players", section: "Club" },
  "/dashboard/teams": { title: "Teams", section: "Club" },
  "/dashboard/training": { title: "Training", section: "Sport" },
  "/dashboard/matches": { title: "Matches", section: "Sport" },
  "/dashboard/attendance": { title: "Attendance", section: "Sport" },
  "/dashboard/members": { title: "Members", section: "Operations" },
  "/dashboard/communication": { title: "Communication", section: "Operations" },
  "/dashboard/documents": { title: "Documents", section: "Operations" },
  "/dashboard/reports": { title: "Reports", section: "Insights" },
  "/dashboard/settings": { title: "Settings", section: "System" },
};

export function DashboardHeader({
  onMobileMenuOpen,
  pageTitle,
}: DashboardHeaderProps) {
  const pathname = usePathname();

  // Determine current page info
  const currentRoute =
    ROUTE_TITLES[pathname] ??
    (pathname.startsWith("/dashboard/players/")
      ? { title: "Player Details", section: "Players" }
      : pathname.startsWith("/dashboard/teams/")
      ? { title: "Team Details", section: "Teams" }
      : pathname.startsWith("/dashboard/training/")
      ? { title: "Training Details", section: "Training" }
      : pathname.startsWith("/dashboard/matches/")
      ? { title: "Match Details", section: "Matches" }
      : { title: "Dashboard", section: "ClubSheet" });

  const resolvedTitle = pageTitle ?? currentRoute.title;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 text-card-foreground">
      {/* Left: Mobile menu trigger & Breadcrumb/Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMobileMenuOpen}
          aria-label="Open navigation"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden shrink-0"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="hidden sm:inline-block text-muted-foreground font-normal">
            {currentRoute.section}
          </span>
          <span className="hidden sm:inline-block text-muted-foreground/60">/</span>
          <h1 className="truncate font-semibold text-foreground">
            {resolvedTitle}
          </h1>
        </div>
      </div>

      {/* Center/Right: Global search placeholder, Theme toggle & Notifications */}
      <div className="flex items-center gap-2.5">
        {/* Global Search trigger */}
        <div className="relative hidden md:flex items-center">
          <Search
            className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            readOnly
            placeholder="Search ClubSheet... (⌘K)"
            aria-label="Search ClubSheet"
            className="h-8 w-48 lg:w-64 rounded-lg border border-border bg-muted/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none cursor-pointer hover:border-primary/50 transition-colors"
          />
        </div>

        {/* Quick Theme Switcher */}
        <ThemeToggle variant="icon-button" />

        {/* Notifications Dropdown */}
        <NotificationsDropdown />
      </div>
    </header>
  );
}

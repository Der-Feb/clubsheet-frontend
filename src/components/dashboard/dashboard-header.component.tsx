"use client";

import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { NotificationsDropdown } from "./notifications-dropdown.component";

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
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4">
      {/* Left: Mobile menu trigger & Breadcrumb/Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMobileMenuOpen}
          aria-label="Open navigation"
          className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors lg:hidden shrink-0"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="hidden sm:inline-block text-zinc-400 font-normal">
            {currentRoute.section}
          </span>
          <span className="hidden sm:inline-block text-zinc-300">/</span>
          <h1 className="truncate font-semibold text-zinc-800">
            {resolvedTitle}
          </h1>
        </div>
      </div>

      {/* Center/Right: Global search placeholder & Notifications */}
      <div className="flex items-center gap-2">
        {/* Global Search trigger */}
        <div className="relative hidden md:flex items-center">
          <Search
            className="absolute left-2.5 h-3.5 w-3.5 text-zinc-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            readOnly
            placeholder="Search ClubSheet... (⌘K)"
            aria-label="Search ClubSheet"
            className="h-8 w-48 lg:w-64 rounded-lg border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-xs text-zinc-600 placeholder:text-zinc-400 focus:outline-none cursor-pointer hover:border-zinc-300 transition-colors"
          />
        </div>

        {/* Notifications Dropdown */}
        <NotificationsDropdown />
      </div>
    </header>
  );
}

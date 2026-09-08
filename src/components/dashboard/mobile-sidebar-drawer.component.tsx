"use client";

import { X } from "lucide-react";
import { useCurrentClub } from "@/hooks/use-current-club.hook";
import { MOCK_USER } from "@/mocks/user.mock";
import { ClubSwitcher } from "./club-switcher.component";
import { UserMenu } from "./user-menu.component";
import { DashboardNav } from "./navigation/dashboard-nav.component";

interface MobileSidebarDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebarDrawer({ open, onClose }: MobileSidebarDrawerProps) {
  const { activeClub, clubs, setActiveClub } = useCurrentClub();

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        aria-label="Mobile navigation"
        className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-3 py-3">
          <div className="flex-1 min-w-0">
            <ClubSwitcher
              activeClub={activeClub}
              clubs={clubs}
              onSelect={(club) => {
                setActiveClub(club);
                onClose();
              }}
              isCollapsed={false}
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-2 shrink-0 rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <DashboardNav isCollapsed={false} onNavigate={onClose} />
        </div>

        {/* User */}
        <div className="border-t border-zinc-100 px-2 py-3">
          <UserMenu user={MOCK_USER} isCollapsed={false} />
        </div>
      </aside>
    </>
  );
}

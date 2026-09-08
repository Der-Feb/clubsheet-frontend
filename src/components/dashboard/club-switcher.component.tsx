"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Club } from "@/mocks/clubs.mock";
import { useTheme } from "@/hooks/use-theme.hook";
import { DEFAULT_CLUBSHEET_BRAND } from "@/config/theme.config";

interface ClubSwitcherProps {
  activeClub: Club;
  clubs: Club[];
  onSelect: (club: Club) => void;
  isCollapsed?: boolean;
}

export function ClubSwitcher({
  activeClub,
  clubs,
  onSelect,
  isCollapsed = false,
}: ClubSwitcherProps) {
  const [open, setOpen] = useState(false);
  const { setBrand } = useTheme();

  function handleSelect(club: Club) {
    onSelect(club);
    setBrand(club.brand || DEFAULT_CLUBSHEET_BRAND);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-muted cursor-pointer",
          isCollapsed && "justify-center px-2"
        )}
      >
        {/* Club avatar */}
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground shadow-xs"
          aria-hidden="true"
        >
          {activeClub.abbr.slice(0, 2)}
        </span>

        {!isCollapsed && (
          <>
            <span className="flex-1 truncate text-left text-foreground font-semibold">
              {activeClub.name}
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown */}
          <div
            role="listbox"
            aria-label="Select club"
            className={cn(
              "absolute z-20 mt-1 min-w-[220px] rounded-xl border border-border bg-card py-1 shadow-lg",
              isCollapsed ? "left-full ml-2 top-0" : "left-0 top-full"
            )}
          >
            <p className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Your clubs
            </p>

            {clubs.map((club) => {
              const isSelected = club.id === activeClub.id;
              return (
                <button
                  key={club.id}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelect(club)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-[9px] font-bold text-primary-foreground"
                    style={
                      club.brand?.primary
                        ? { backgroundColor: club.brand.primary }
                        : undefined
                    }
                  >
                    {club.abbr.slice(0, 2)}
                  </span>
                  <span className="flex-1 truncate text-left text-xs font-medium">
                    {club.name}
                  </span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  )}
                </button>
              );
            })}

            <div className="mx-3 my-1 border-t border-border" />

            <button
              type="button"
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-dashed border-border">
                <Plus className="h-3 w-3" />
              </span>
              Add a club
            </button>
          </div>
        </>
      )}
    </div>
  );
}

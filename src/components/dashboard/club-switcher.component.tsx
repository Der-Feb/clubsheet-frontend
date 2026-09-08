"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Club } from "@/mocks/clubs.mock";

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

  function handleSelect(club: Club) {
    onSelect(club);
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
          "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-zinc-100",
          isCollapsed && "justify-center px-2"
        )}
      >
        {/* Club avatar */}
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#005F31] text-[10px] font-bold text-white"
          aria-hidden="true"
        >
          {activeClub.abbr.slice(0, 2)}
        </span>

        {!isCollapsed && (
          <>
            <span className="flex-1 truncate text-left text-zinc-800">
              {activeClub.name}
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
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
              "absolute z-20 mt-1 min-w-[200px] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg",
              isCollapsed ? "left-full ml-2 top-0" : "left-0 top-full"
            )}
          >
            <p className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
              Your clubs
            </p>

            {clubs.map((club) => (
              <button
                key={club.id}
                role="option"
                aria-selected={club.id === activeClub.id}
                type="button"
                onClick={() => handleSelect(club)}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#005F31] text-[9px] font-bold text-white">
                  {club.abbr.slice(0, 2)}
                </span>
                <span className="flex-1 truncate text-left">{club.name}</span>
                {club.id === activeClub.id && (
                  <Check className="h-3.5 w-3.5 text-[#005F31]" />
                )}
              </button>
            ))}

            <div className="mx-3 my-1 border-t border-zinc-100" />

            <button
              type="button"
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 transition-colors"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-300">
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

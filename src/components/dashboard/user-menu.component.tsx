"use client";

import { useState } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MockUser } from "@/mocks/user.mock";

interface UserMenuProps {
  user: MockUser;
  isCollapsed?: boolean;
}

export function UserMenu({ user, isCollapsed = false }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        title={isCollapsed ? `${user.name} (${user.role ?? "User"})` : undefined}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-zinc-100",
          isCollapsed && "justify-center"
        )}
      >
        {/* Avatar */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-[#005F31]">
          {user.initials}
        </span>

        {!isCollapsed && (
          <div className="flex flex-col items-start overflow-hidden leading-tight text-left">
            <span className="truncate text-sm font-medium text-zinc-800">
              {user.name}
            </span>
            <span className="truncate text-[11px] font-medium text-zinc-400">
              {user.role ?? user.email}
            </span>
          </div>
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

          {/* Menu */}
          <div
            role="menu"
            aria-label="User menu"
            className={cn(
              "absolute z-20 min-w-[210px] rounded-xl border border-zinc-200 bg-white py-1 shadow-lg",
              isCollapsed
                ? "bottom-0 left-full ml-2"
                : "bottom-full left-0 mb-1"
            )}
          >
            <div className="px-3 py-2 border-b border-zinc-100">
              <p className="text-sm font-semibold text-zinc-800">{user.name}</p>
              <p className="text-xs text-zinc-400 truncate">{user.email}</p>
              {user.role && (
                <span className="mt-1.5 inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#005F31]">
                  {user.role}
                </span>
              )}
            </div>

            <div className="py-1">
              <button
                role="menuitem"
                type="button"
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                <User className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                Profile
              </button>

              <button
                role="menuitem"
                type="button"
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                <Settings className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                Account settings
              </button>
            </div>

            <div className="mx-3 border-t border-zinc-100" />

            <div className="py-1">
              <button
                role="menuitem"
                type="button"
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

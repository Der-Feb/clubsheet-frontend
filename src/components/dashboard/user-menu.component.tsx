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
          "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted cursor-pointer",
          isCollapsed && "justify-center"
        )}
      >
        {/* Avatar */}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-xs font-semibold text-primary border border-primary/20">
          {user.initials}
        </span>

        {!isCollapsed && (
          <div className="flex flex-col items-start overflow-hidden leading-tight text-left">
            <span className="truncate text-sm font-medium text-foreground">
              {user.name}
            </span>
            <span className="truncate text-[11px] font-medium text-muted-foreground">
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
              "absolute z-20 w-[min(220px,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] min-w-0 rounded-xl border border-border bg-card py-1 text-card-foreground shadow-lg",
              isCollapsed
                ? "bottom-0 left-full ml-2"
                : "bottom-full left-0 mb-1"
            )}
          >
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              {user.role && (
                <span className="mt-1.5 inline-flex items-center rounded-md bg-primary-subtle px-1.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                  {user.role}
                </span>
              )}
            </div>

            <div className="py-1">
              <button
                role="menuitem"
                type="button"
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Profile
              </button>

              <button
                role="menuitem"
                type="button"
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <Settings className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Account settings
              </button>
            </div>

            <div className="mx-3 border-t border-border" />

            <div className="py-1">
              <button
                role="menuitem"
                type="button"
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-danger hover:bg-danger/10 transition-colors cursor-pointer"
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

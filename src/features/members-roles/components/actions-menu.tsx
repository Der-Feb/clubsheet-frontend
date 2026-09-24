"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  User,
  Shield,
  UserX,
  UserCheck,
  Trash2,
} from "lucide-react";
import type { Member } from "@/types/members-roles.types";

interface ActionsMenuProps {
  member: Member;
  onViewProfile: () => void;
  onChangeRole: () => void;
  onToggleStatus: () => void;
  onRemove: () => void;
}

export function ActionsMenu({
  member,
  onViewProfile,
  onChangeRole,
  onToggleStatus,
  onRemove,
}: ActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const isSuspended = member.status === "Suspended";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        aria-label={`Actions for ${member.name}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-30 w-48 rounded-xl border border-border bg-card p-1 shadow-lg text-card-foreground animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onViewProfile();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span>View Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onChangeRole();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            <Shield className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Change Role</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onToggleStatus();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            {isSuspended ? (
              <>
                <UserCheck className="h-3.5 w-3.5 text-success" />
                <span>Reactivate Member</span>
              </>
            ) : (
              <>
                <UserX className="h-3.5 w-3.5 text-warning" />
                <span>Suspend Member</span>
              </>
            )}
          </button>

          <div className="my-1 border-t border-border" />

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onRemove();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-danger hover:bg-danger/10 cursor-pointer transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5 text-danger" />
            <span>Remove from Club</span>
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  User,
  FilePlus,
  Star,
  Eye,
  ArrowRightCircle,
  UserX,
} from "lucide-react";
import type { ScoutingTarget } from "@/types/scouting.types";

interface ScoutingActionsMenuProps {
  target: ScoutingTarget;
  onViewProfile: () => void;
  onAddReport: () => void;
  onShortlist: () => void;
  onMoveToWatching: () => void;
  onOpenTransfer: () => void;
  onDrop: () => void;
}

export function ScoutingActionsMenu({
  target,
  onViewProfile,
  onAddReport,
  onShortlist,
  onMoveToWatching,
  onOpenTransfer,
  onDrop,
}: ScoutingActionsMenuProps) {
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

  const isShortlisted = target.status === "SHORTLISTED";
  const isWatching = target.status === "WATCHING";
  const isDropped = target.status === "DROPPED";
  const isTransferOpened = target.status === "TRANSFER_OPENED";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        aria-label={`Actions for ${target.externalName}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
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
              onAddReport();
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            <FilePlus className="h-3.5 w-3.5 text-primary" />
            <span>Add Report</span>
          </button>

          {!isShortlisted && !isTransferOpened && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onShortlist();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              <Star className="h-3.5 w-3.5 text-warning" />
              <span>Shortlist</span>
            </button>
          )}

          {!isWatching && !isTransferOpened && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onMoveToWatching();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              <Eye className="h-3.5 w-3.5 text-info" />
              <span>Move to Watching</span>
            </button>
          )}

          {/* Open Transfer option (only enabled when status is SHORTLISTED) */}
          <button
            type="button"
            disabled={!isShortlisted}
            onClick={() => {
              setIsOpen(false);
              onOpenTransfer();
            }}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              isShortlisted
                ? "text-primary hover:bg-primary-subtle cursor-pointer"
                : "text-muted-foreground/50 cursor-not-allowed"
            }`}
            title={
              !isShortlisted
                ? "Open Transfer is only available when prospect is Shortlisted"
                : undefined
            }
          >
            <ArrowRightCircle className="h-3.5 w-3.5" />
            <span>Open Transfer</span>
          </button>

          <div className="my-1 border-t border-border" />

          {!isDropped && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onDrop();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-danger hover:bg-danger/10 cursor-pointer transition-colors"
            >
              <UserX className="h-3.5 w-3.5 text-danger" />
              <span>Drop Prospect</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

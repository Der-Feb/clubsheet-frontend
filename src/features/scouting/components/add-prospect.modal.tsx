"use client";

import { useState, useEffect } from "react";
import { X, Plus, Target } from "lucide-react";
import type { ScoutingStatus } from "@/types/scouting.types";

interface AddProspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTarget: (
    externalName: string,
    primaryPosition: string,
    currentClub: string,
    status: ScoutingStatus
  ) => void;
  isLoading?: boolean;
}

export function AddProspectModal({
  isOpen,
  onClose,
  onCreateTarget,
  isLoading = false,
}: AddProspectModalProps) {
  const [externalName, setExternalName] = useState("");
  const [primaryPosition, setPrimaryPosition] = useState("Striker");
  const [currentClub, setCurrentClub] = useState("");
  const [status, setStatus] = useState<ScoutingStatus>("WATCHING");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setExternalName("");
      setPrimaryPosition("Striker");
      setCurrentClub("");
      setStatus("WATCHING");
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalName.trim()) {
      setError("Prospect name is required.");
      return;
    }
    onCreateTarget(
      externalName.trim(),
      primaryPosition,
      currentClub.trim() || "Free Agent / Unknown",
      status
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-prospect-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 id="add-prospect-title" className="text-base font-bold text-foreground">
              Add Scouting Prospect
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Prospect Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Prospect Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={externalName}
              onChange={(e) => {
                setExternalName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g., Innocent Nshuti, Hakim Sahabo"
              className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {error && <p className="text-[11px] text-danger">{error}</p>}
          </div>

          {/* Primary Position */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Primary Position
            </label>
            <select
              value={primaryPosition}
              onChange={(e) => setPrimaryPosition(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="Striker">Striker / Centre-Forward</option>
              <option value="Winger">Winger (Left / Right)</option>
              <option value="Attacking Midfield">Attacking Midfield (CAM)</option>
              <option value="Central Midfield">Central Midfield (CM)</option>
              <option value="Defensive Midfield">Defensive Midfield (CDM)</option>
              <option value="Centre-Back">Centre-Back (CB)</option>
              <option value="Full-Back">Full-Back / Wing-Back</option>
              <option value="Goalkeeper">Goalkeeper (GK)</option>
            </select>
          </div>

          {/* Current Club */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Current Club / Academy
            </label>
            <input
              type="text"
              value={currentClub}
              onChange={(e) => setCurrentClub(e.target.value)}
              placeholder="e.g., Stade Malien, Rayon Sports, Free Agent"
              className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Initial Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Initial Watchlist Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ScoutingStatus)}
              className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="WATCHING">Watching (Under Evaluation)</option>
              <option value="SHORTLISTED">Shortlisted (Target Priority)</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              {isLoading ? "Adding..." : "Add Prospect"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

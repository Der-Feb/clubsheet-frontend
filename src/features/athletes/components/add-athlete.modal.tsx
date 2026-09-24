"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Shield, Hash, Calendar, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ScrollArea";

export interface NewAthleteInput {
  name: string;
  team: string;
  position: string;
  number: number;
  status: "Active" | "Injured" | "Pending" | "Suspended";
  avatar: string;
  joined: string;
}

interface AddAthleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAthlete: (athlete: NewAthleteInput) => void;
}

const TEAMS = [
  "Senior First Team",
  "Under-17 Academy",
  "Under-15 Development",
  "Women’s Senior Team",
  "Under-13 Grassroots",
];

const POSITIONS = [
  "Forward",
  "Winger",
  "Midfielder",
  "Attacking Midfielder",
  "Defensive Midfielder",
  "Center Back",
  "Fullback",
  "Goalkeeper",
];

export function AddAthleteModal({
  isOpen,
  onClose,
  onAddAthlete,
}: AddAthleteModalProps) {
  const [name, setName] = useState("");
  const [team, setTeam] = useState(TEAMS[0]);
  const [position, setPosition] = useState(POSITIONS[0]);
  const [number, setNumber] = useState<number | "">("");
  const [status, setStatus] = useState<"Active" | "Injured" | "Pending" | "Suspended">("Active");
  const [joined, setJoined] = useState(
    new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setTeam(TEAMS[0]);
      setPosition(POSITIONS[0]);
      setNumber("");
      setStatus("Active");
      setJoined(new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }));
      setError("");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AT";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Athlete name is required");
      return;
    }
    const num = typeof number === "number" ? number : parseInt(String(number), 10);
    if (isNaN(num) || num < 1 || num > 99) {
      setError("Please enter a valid squad number between 1 and 99");
      return;
    }

    onAddAthlete({
      name: name.trim(),
      team,
      position,
      number: num,
      status,
      avatar: getInitials(name.trim()),
      joined,
    });

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
      <ScrollArea
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-athlete-title"
        className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h2 id="add-athlete-title" className="text-base font-bold text-foreground">
              Register New Athlete
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-xs text-danger font-medium">
              {error}
            </div>
          )}

          {/* Athlete Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Full Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. John Mugabo"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              required
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Squad & Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Squad / Team</label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {TEAMS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Squad Number & Initial Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Jersey Number <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="number"
                  min="1"
                  max="99"
                  placeholder="e.g. 10"
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value === "" ? "" : Number(e.target.value));
                    setError("");
                  }}
                  required
                  className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Squad Status</label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "Active" | "Injured" | "Pending" | "Suspended")
                }
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Injured">Injured</option>
                <option value="Pending">Pending Clearance</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Registration Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Joined Period</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="e.g. Sep 2026"
                value={joined}
                onChange={(e) => setJoined(e.target.value)}
                className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              Add to Squad
            </button>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
}

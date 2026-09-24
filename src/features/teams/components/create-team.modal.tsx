"use client";

import { useState, useEffect } from "react";
import { X, ShieldPlus, Trophy, Users, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ScrollArea";

export interface NewTeamInput {
  name: string;
  category: string;
  headCoach: string;
  assistantCoach: string;
  athleteCount: number;
  nextSession: string;
  nextMatch: string;
  league: string;
}

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: (team: NewTeamInput) => void;
}

const CATEGORIES = [
  "Senior",
  "U21",
  "U17",
  "U15",
  "U13",
  "Senior Women",
  "Grassroots",
];

export function CreateTeamModal({
  isOpen,
  onClose,
  onCreateTeam,
}: CreateTeamModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [headCoach, setHeadCoach] = useState("");
  const [assistantCoach, setAssistantCoach] = useState("");
  const [athleteCount, setAthleteCount] = useState<number>(18);
  const [league, setLeague] = useState("");
  const [homePitch, setHomePitch] = useState("Pitch A");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setCategory(CATEGORIES[0]);
      setHeadCoach("");
      setAssistantCoach("");
      setAthleteCount(18);
      setLeague("");
      setHomePitch("Pitch A");
      setError("");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Team name is required");
      return;
    }
    if (!headCoach.trim()) {
      setError("Head coach is required");
      return;
    }

    onCreateTeam({
      name: name.trim(),
      category,
      headCoach: headCoach.trim(),
      assistantCoach: assistantCoach.trim() || "TBD",
      athleteCount: athleteCount || 0,
      nextSession: `Tomorrow at 16:30 (${homePitch})`,
      nextMatch: "Fixtures to be scheduled",
      league: league.trim() || "Regional League",
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
        aria-labelledby="create-team-title"
        className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShieldPlus className="h-5 w-5 text-primary" />
            <h2 id="create-team-title" className="text-base font-bold text-foreground">
              Create New Squad / Team
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

          {/* Squad Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Squad / Team Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Under-19 Youth Academy"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              required
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Category & League */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Age Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Competition / League</label>
              <div className="relative">
                <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. National Youth League"
                  value={league}
                  onChange={(e) => setLeague(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Coaches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Head Coach <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Emmanuel Mugisha"
                value={headCoach}
                onChange={(e) => {
                  setHeadCoach(e.target.value);
                  setError("");
                }}
                required
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Assistant Coach</label>
              <input
                type="text"
                placeholder="e.g. Jean Claude N."
                value={assistantCoach}
                onChange={(e) => setAssistantCoach(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Squad size & Home facility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Initial Roster Size</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={athleteCount}
                  onChange={(e) => setAthleteCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Home Pitch / Facility</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. Pitch A (Main Stadium)"
                  value={homePitch}
                  onChange={(e) => setHomePitch(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
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
              Create Team
            </button>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
}

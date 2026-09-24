"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Trophy, MapPin, Clock, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ScrollArea";

export interface NewMatchInput {
  opponent: string;
  opponentLogo: string;
  competition: string;
  date: string;
  time: string;
  venue: string;
  isHome: boolean;
  status: "Upcoming" | "Completed" | "Live";
  team: string;
}

interface ScheduleMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleMatch: (match: NewMatchInput) => void;
}

const TEAMS = [
  "Senior First Team",
  "Under-17 Academy",
  "Under-15 Development",
  "Women’s Senior Team",
  "Under-13 Grassroots",
];

export function ScheduleMatchModal({
  isOpen,
  onClose,
  onScheduleMatch,
}: ScheduleMatchModalProps) {
  const [team, setTeam] = useState(TEAMS[0]);
  const [opponent, setOpponent] = useState("");
  const [competition, setCompetition] = useState("National League — Matchday 1");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [time, setTime] = useState("15:00 CAT");
  const [venue, setVenue] = useState("Amahoro National Stadium");
  const [isHome, setIsHome] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTeam(TEAMS[0]);
      setOpponent("");
      setCompetition("National League — Matchday 1");
      setDate(new Date().toISOString().split("T")[0]);
      setTime("15:00 CAT");
      setVenue("Amahoro National Stadium");
      setIsHome(true);
      setError("");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getOpponentLogoTag = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 3).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponent.trim()) {
      setError("Opponent name is required");
      return;
    }
    if (!venue.trim()) {
      setError("Venue is required");
      return;
    }

    // Format display date
    const parsedDate = new Date(`${date}T12:00:00`);
    const dateFormatted = parsedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    onScheduleMatch({
      opponent: opponent.trim(),
      opponentLogo: getOpponentLogoTag(opponent.trim()),
      competition: competition.trim(),
      date: dateFormatted,
      time: time.trim(),
      venue: venue.trim(),
      isHome,
      status: "Upcoming",
      team,
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
        aria-labelledby="schedule-match-title"
        className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 id="schedule-match-title" className="text-base font-bold text-foreground">
              Schedule Match Fixture
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

          {/* Team and Opponent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Club Squad</label>
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
              <label className="text-xs font-semibold text-foreground">
                Opponent Club <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rayon Sports FC"
                value={opponent}
                onChange={(e) => {
                  setOpponent(e.target.value);
                  setError("");
                }}
                required
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Competition */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Competition / Tournament</label>
            <div className="relative">
              <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="e.g. Rwanda Premier League — Matchday 16"
                value={competition}
                onChange={(e) => setCompetition(e.target.value)}
                className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Match Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Kickoff Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. 15:30 CAT"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Venue and Fixture Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Matchday Venue</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="e.g. Kigali Pelé Stadium"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Home vs Away Toggle */}
          <div className="flex items-center gap-3 pt-1">
            <label className="text-xs font-semibold text-foreground">Fixture Location:</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsHome(true)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  isHome
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                Home (Main Ground)
              </button>
              <button
                type="button"
                onClick={() => setIsHome(false)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  !isHome
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border bg-muted/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                Away Match
              </button>
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
              Schedule Match
            </button>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
}

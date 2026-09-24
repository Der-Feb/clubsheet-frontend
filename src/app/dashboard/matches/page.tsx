"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  ScheduleMatchModal,
  type NewMatchInput,
} from "@/features/matches/components/schedule-match.modal";

interface Match {
  id: string;
  opponent: string;
  opponentLogo: string;
  competition: string;
  date: string;
  time: string;
  venue: string;
  isHome: boolean;
  status: "Upcoming" | "Completed" | "Live";
  score?: string;
  team: string;
}

const INITIAL_MATCHES: Match[] = [
  {
    id: "m-201",
    opponent: "APR FC",
    opponentLogo: "APR",
    competition: "Rwanda Premier League — Matchday 14",
    date: "Saturday, Sep 12, 2026",
    time: "15:00 CAT",
    venue: "Amahoro National Stadium",
    isHome: true,
    status: "Upcoming",
    team: "Senior First Team",
  },
  {
    id: "m-202",
    opponent: "Rayon Sports FC",
    opponentLogo: "RS",
    competition: "Rwanda Premier League — Matchday 15",
    date: "Sunday, Sep 20, 2026",
    time: "15:30 CAT",
    venue: "Kigali Pelé Stadium",
    isHome: false,
    status: "Upcoming",
    team: "Senior First Team",
  },
  {
    id: "m-203",
    opponent: "Heroes Academy U17",
    opponentLogo: "HA",
    competition: "National Youth League — Round 6",
    date: "Saturday, Sep 19, 2026",
    time: "10:00 CAT",
    venue: "Kigali FC Academy Ground",
    isHome: true,
    status: "Upcoming",
    team: "Under-17 Academy",
  },
  {
    id: "m-200",
    opponent: "Mukura Victory Sports",
    opponentLogo: "MVS",
    competition: "Rwanda Premier League — Matchday 13",
    date: "Aug 30, 2026",
    time: "15:00 CAT",
    venue: "Huye Stadium",
    isHome: false,
    status: "Completed",
    score: "2 - 1",
    team: "Senior First Team",
  },
];

function MatchesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const isScheduleModalOpen = searchParams.get("newMatch") === "active";

  const openScheduleModal = () => router.push("/dashboard/matches?newMatch=active");
  const closeScheduleModal = () => router.push("/dashboard/matches");

  const handleScheduleMatch = (newMatch: NewMatchInput) => {
    const created: Match = {
      ...newMatch,
      id: `m-${Date.now()}`,
    };
    setMatches((prev) => [created, ...prev]);
  };

  const upcomingMatches = matches.filter((m) => m.status === "Upcoming");
  const nextMatch = upcomingMatches[0];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Matches
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fixtures, results, lineups, and matchday logistics across all competitions.
          </p>
        </div>

        <button
          type="button"
          onClick={openScheduleModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Schedule Match
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Next Match</p>
          <p className="mt-1 text-lg font-bold text-foreground">
            {nextMatch ? `vs ${nextMatch.opponent}` : "No upcoming fixtures"}
          </p>
          <p className="mt-0.5 text-xs text-primary font-medium">
            {nextMatch ? `${nextMatch.date.split(",")[0]}, ${nextMatch.time} (${nextMatch.venue})` : "Season break"}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">League Position</p>
          <p className="mt-1 text-lg font-bold text-foreground">2nd Place (28 pts)</p>
          <p className="mt-0.5 text-xs text-muted-foreground">+14 Goal Differential</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Recent Form</p>
          <p className="mt-1 text-lg font-bold text-success">W • W • D • W • L</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Last 5 League matches</p>
        </div>
      </div>

      {/* Match Fixtures List */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Match Schedule & Results
        </h2>

        <div className="space-y-3">
          {matches.map((match) => (
            <div
              key={match.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-card-foreground"
            >
              {/* Left: Teams & Competition */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground border border-border">
                    {match.team}
                  </span>
                  <span className="text-xs text-muted-foreground/60">•</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {match.competition}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-xs">
                    {match.opponentLogo}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">
                      {match.isHome ? `Club vs ${match.opponent}` : `${match.opponent} vs Club`}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {match.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {match.time}
                      </span>
                      <span className="flex items-center gap-1 hidden md:flex">
                        <MapPin className="h-3.5 w-3.5" /> {match.venue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Status / Score & Action */}
              <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                {match.status === "Completed" ? (
                  <div className="text-right">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-foreground border border-border">
                      Final
                    </span>
                    <p className="text-base font-bold text-foreground mt-1">{match.score}</p>
                  </div>
                ) : (
                  <span className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                    {match.status}
                  </span>
                )}

                <Link
                  href={`/dashboard/matches/${match.id}`}
                  className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Matchday Center <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ScheduleMatchModal
        isOpen={isScheduleModalOpen}
        onClose={closeScheduleModal}
        onScheduleMatch={handleScheduleMatch}
      />
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading matches...</div>}>
      <MatchesContent />
    </Suspense>
  );
}

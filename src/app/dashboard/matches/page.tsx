import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Plus,
} from "lucide-react";

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

const MATCHES: Match[] = [
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

export default function MatchesPage() {
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
          <p className="mt-1 text-lg font-bold text-foreground">vs APR FC</p>
          <p className="mt-0.5 text-xs text-primary font-medium">Sat, 15:00 at Amahoro</p>
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
          {MATCHES.map((match) => (
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
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[10px] font-bold text-primary-foreground shadow-xs">
                      KFC
                    </span>
                    <span className="text-base font-bold text-foreground">
                      Kigali FC
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-muted-foreground px-1">
                    {match.status === "Completed" ? match.score : "vs"}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted border border-border text-[10px] font-bold text-foreground">
                      {match.opponentLogo}
                    </span>
                    <span className="text-base font-bold text-foreground">
                      {match.opponent}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {match.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {match.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {match.venue} ({match.isHome ? "Home" : "Away"})
                  </span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <Link
                  href={`/dashboard/matches/${match.id}`}
                  className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors"
                >
                  <span>Match Centre</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

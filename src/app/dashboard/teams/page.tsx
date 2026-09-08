import Link from "next/link";
import {
  Shield,
  Users,
  Plus,
  Clock,
  ChevronRight,
  UserCheck,
  Trophy,
} from "lucide-react";

interface Team {
  id: string;
  name: string;
  category: string;
  headCoach: string;
  assistantCoach: string;
  playerCount: number;
  nextSession: string;
  nextMatch: string;
  league: string;
}

const TEAMS: Team[] = [
  {
    id: "team-senior",
    name: "Senior First Team",
    category: "Senior",
    headCoach: "Emmanuel Mugisha",
    assistantCoach: "Jean Claude N.",
    playerCount: 26,
    nextSession: "Today at 18:00 (Pitch A)",
    nextMatch: "vs APR FC (Sat 15:00)",
    league: "Rwanda Premier League",
  },
  {
    id: "team-u17",
    name: "Under-17 Academy",
    category: "U17",
    headCoach: "Dieudonné Habimana",
    assistantCoach: "Eric Ndahiro",
    playerCount: 22,
    nextSession: "Tomorrow at 16:30 (Pitch B)",
    nextMatch: "vs Heroes Academy (Sun 10:00)",
    league: "National Youth League",
  },
  {
    id: "team-u15",
    name: "Under-15 Development",
    category: "U15",
    headCoach: "Moses Karasira",
    assistantCoach: "Alexis Bizimana",
    playerCount: 24,
    nextSession: "Wed at 16:00 (Pitch C)",
    nextMatch: "vs Gasabo Stars (Sat 09:30)",
    league: "Regional Junior Cup",
  },
  {
    id: "team-women",
    name: "Women’s Senior Team",
    category: "Senior Women",
    headCoach: "Aline Uwase",
    assistantCoach: "Claire Mutoni",
    playerCount: 23,
    nextSession: "Thu at 17:30 (Pitch A)",
    nextMatch: "vs Inyange FC (Sun 14:00)",
    league: "Women’s National Championship",
  },
  {
    id: "team-u13",
    name: "Under-13 Grassroots",
    category: "U13",
    headCoach: "Samuel Nkurunziza",
    assistantCoach: "David M.",
    playerCount: 20,
    nextSession: "Friday at 15:30 (Pitch B)",
    nextMatch: "Friendly Tournament (Sun 08:30)",
    league: "Youth Grassroots League",
  },
];

export default function TeamsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Teams</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of club squads, age categories, technical staff, and rosters.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Team
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Active Squads</p>
          <p className="mt-1 text-2xl font-bold text-foreground">5 Divisions</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Junior, Youth, and Senior</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Rostered Players</p>
          <p className="mt-1 text-2xl font-bold text-primary">115 Players</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Across all competitive squads</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Coaching Staff</p>
          <p className="mt-1 text-2xl font-bold text-foreground">10 Coaches</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Licensed technical directors</p>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEAMS.map((team) => (
          <div
            key={team.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 transition-all text-card-foreground"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground border border-border">
                    {team.category}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-foreground">
                    {team.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{team.league}</p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-subtle text-primary border border-primary/20">
                  <Shield className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 space-y-3 pt-4 border-t border-border text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <UserCheck className="h-3.5 w-3.5" /> Head Coach
                  </span>
                  <span className="font-semibold text-foreground">{team.headCoach}</span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> Squad Size
                  </span>
                  <span className="font-semibold text-foreground">
                    {team.playerCount} Players
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> Next Session
                  </span>
                  <span className="font-medium text-foreground text-right truncate max-w-[170px]">
                    {team.nextSession}
                  </span>
                </div>

                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Trophy className="h-3.5 w-3.5" /> Next Match
                  </span>
                  <span className="font-medium text-primary text-right truncate max-w-[170px]">
                    {team.nextMatch}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-border">
              <Link
                href={`/dashboard/teams/${team.id}`}
                className="flex items-center justify-between text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                <span>View squad & roster</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

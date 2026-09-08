import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  number: number;
  status: "Active" | "Injured" | "Pending" | "Suspended";
  avatar: string;
  joined: string;
}

const PLAYERS: Player[] = [
  {
    id: "p-1",
    name: "John Mugabo",
    team: "Senior Team",
    position: "Forward",
    number: 9,
    status: "Active",
    avatar: "JM",
    joined: "Jan 2024",
  },
  {
    id: "p-2",
    name: "Eric Nshimiyimana",
    team: "Senior Team",
    position: "Midfielder",
    number: 8,
    status: "Active",
    avatar: "EN",
    joined: "Aug 2023",
  },
  {
    id: "p-3",
    name: "Claude Habimana",
    team: "Senior Team",
    position: "Goalkeeper",
    number: 1,
    status: "Active",
    avatar: "CH",
    joined: "Mar 2022",
  },
  {
    id: "p-4",
    name: "David Kwizera",
    team: "U17",
    position: "Defender",
    number: 4,
    status: "Injured",
    avatar: "DK",
    joined: "Sep 2024",
  },
  {
    id: "p-5",
    name: "Patrick Bizimana",
    team: "U17",
    position: "Winger",
    number: 11,
    status: "Active",
    avatar: "PB",
    joined: "Feb 2024",
  },
  {
    id: "p-6",
    name: "Innocent Ruhinda",
    team: "U15",
    position: "Center Back",
    number: 5,
    status: "Pending",
    avatar: "IR",
    joined: "Aug 2025",
  },
  {
    id: "p-7",
    name: "Aimable Kagame",
    team: "Senior Team",
    position: "Midfielder",
    number: 10,
    status: "Active",
    avatar: "AK",
    joined: "Jun 2023",
  },
  {
    id: "p-8",
    name: "Jean Paul Ndayishimiye",
    team: "U17",
    position: "Fullback",
    number: 3,
    status: "Active",
    avatar: "JN",
    joined: "Nov 2024",
  },
];

export default function PlayersPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Players
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage player rosters, positions, registrations, and club profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            Export Roster
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Player
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Total Players</p>
          <p className="mt-1 text-2xl font-bold text-foreground">248</p>
          <p className="mt-0.5 text-xs text-primary font-medium">+12 this month</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Active Squad</p>
          <p className="mt-1 text-2xl font-bold text-foreground">226</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Eligible for selection</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Injured / Out</p>
          <p className="mt-1 text-2xl font-bold text-warning">8</p>
          <p className="mt-0.5 text-xs text-muted-foreground">In medical recovery</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Academy Youth</p>
          <p className="mt-1 text-2xl font-bold text-foreground">114</p>
          <p className="mt-0.5 text-xs text-muted-foreground">U15 & U17 pathways</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs text-card-foreground">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search players by name, number..."
            className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
          >
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span>All Teams</span>
          </button>
          <button
            type="button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
          >
            <span>Status: All</span>
          </button>
        </div>
      </div>

      {/* Players Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs text-card-foreground">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Number</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {PLAYERS.map((player) => (
                <tr
                  key={player.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-xs font-bold text-primary border border-primary/20">
                        {player.avatar}
                      </div>
                      <div>
                        <Link
                          href={`/dashboard/players/${player.id}`}
                          className="font-semibold text-foreground group-hover:text-primary transition-colors"
                        >
                          {player.name}
                        </Link>
                        <p className="text-[11px] text-muted-foreground">Joined {player.joined}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">
                    {player.team}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{player.position}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center justify-center font-mono font-semibold text-foreground bg-muted rounded-md px-1.5 py-0.5 border border-border">
                      #{player.number}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        player.status === "Active"
                          ? "bg-primary-subtle text-primary border border-primary/20"
                          : player.status === "Injured"
                          ? "bg-warning/10 text-warning border border-warning/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {player.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/dashboard/players/${player.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      Profile <ChevronRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/30 text-xs text-muted-foreground">
          <span>Showing 8 of 248 players</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground/50 cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground hover:bg-muted cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

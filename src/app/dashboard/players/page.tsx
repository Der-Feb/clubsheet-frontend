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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Players
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage player rosters, positions, registrations, and club profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-xs hover:bg-zinc-50 transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-500" />
            Export Roster
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[#005F31] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#01562D] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Player
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-zinc-400 uppercase">Total Players</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">248</p>
          <p className="mt-0.5 text-xs text-[#005F31] font-medium">+12 this month</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-zinc-400 uppercase">Active Squad</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">226</p>
          <p className="mt-0.5 text-xs text-zinc-500">Eligible for selection</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-zinc-400 uppercase">Injured / Out</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">8</p>
          <p className="mt-0.5 text-xs text-zinc-500">In medical recovery</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-zinc-400 uppercase">Academy Youth</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">114</p>
          <p className="mt-0.5 text-xs text-zinc-500">U15 & U17 pathways</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-zinc-200 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search players by name, number..."
            className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-xs text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005F31]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <Filter className="h-3.5 w-3.5 text-zinc-500" />
            <span>All Teams</span>
          </button>
          <button
            type="button"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <span>Status: All</span>
          </button>
        </div>
      </div>

      {/* Players Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/75 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Number</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {PLAYERS.map((player) => (
                <tr
                  key={player.id}
                  className="hover:bg-zinc-50/80 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-[#005F31]">
                        {player.avatar}
                      </div>
                      <div>
                        <Link
                          href={`/dashboard/players/${player.id}`}
                          className="font-semibold text-zinc-900 group-hover:text-[#005F31] transition-colors"
                        >
                          {player.name}
                        </Link>
                        <p className="text-[11px] text-zinc-400">Joined {player.joined}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-zinc-700">
                    {player.team}
                  </td>
                  <td className="py-3 px-4 text-zinc-600">{player.position}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center justify-center font-mono font-semibold text-zinc-700 bg-zinc-100 rounded-md px-1.5 py-0.5">
                      #{player.number}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        player.status === "Active"
                          ? "bg-emerald-50 text-[#005F31]"
                          : player.status === "Injured"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {player.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/dashboard/players/${player.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#005F31] hover:underline"
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
        <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-3 bg-zinc-50/50 text-xs text-zinc-500">
          <span>Showing 8 of 248 players</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-400 cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

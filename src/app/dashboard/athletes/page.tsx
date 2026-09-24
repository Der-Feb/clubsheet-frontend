"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  SlidersHorizontal,
  ChevronRight,
  Download,
} from "lucide-react";
import {
  AddAthleteModal,
  type NewAthleteInput,
} from "@/features/athletes/components/add-athlete.modal";

interface Athlete {
  id: string;
  name: string;
  team: string;
  position: string;
  number: number;
  status: "Active" | "Injured" | "Pending" | "Suspended";
  avatar: string;
  joined: string;
}

const INITIAL_ATHLETES: Athlete[] = [
  {
    id: "p-1",
    name: "John Mugabo",
    team: "Senior First Team",
    position: "Forward",
    number: 9,
    status: "Active",
    avatar: "JM",
    joined: "Jan 2024",
  },
  {
    id: "p-2",
    name: "Eric Nshimiyimana",
    team: "Senior First Team",
    position: "Midfielder",
    number: 8,
    status: "Active",
    avatar: "EN",
    joined: "Aug 2023",
  },
  {
    id: "p-3",
    name: "Claude Habimana",
    team: "Senior First Team",
    position: "Goalkeeper",
    number: 1,
    status: "Active",
    avatar: "CH",
    joined: "Mar 2022",
  },
  {
    id: "p-4",
    name: "David Kwizera",
    team: "Under-17 Academy",
    position: "Defender",
    number: 4,
    status: "Injured",
    avatar: "DK",
    joined: "Sep 2024",
  },
  {
    id: "p-5",
    name: "Patrick Bizimana",
    team: "Under-17 Academy",
    position: "Winger",
    number: 11,
    status: "Active",
    avatar: "PB",
    joined: "Feb 2024",
  },
  {
    id: "p-6",
    name: "Innocent Ruhinda",
    team: "Under-15 Development",
    position: "Center Back",
    number: 5,
    status: "Pending",
    avatar: "IR",
    joined: "Aug 2025",
  },
  {
    id: "p-7",
    name: "Aimable Kagame",
    team: "Senior First Team",
    position: "Midfielder",
    number: 10,
    status: "Active",
    avatar: "AK",
    joined: "Jun 2023",
  },
  {
    id: "p-8",
    name: "Jean Paul Ndayishimiye",
    team: "Under-17 Academy",
    position: "Fullback",
    number: 3,
    status: "Active",
    avatar: "JN",
    joined: "Nov 2024",
  },
];

function AthletesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [athletes, setAthletes] = useState<Athlete[]>(INITIAL_ATHLETES);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | Athlete["status"]>("ALL");
  const isAddModalOpen = searchParams.get("newAthlete") === "active";

  const openAddModal = () => router.push("/dashboard/athletes?newAthlete=active");
  const closeAddModal = () => router.push("/dashboard/athletes");

  const handleAddAthlete = (newAthlete: NewAthleteInput) => {
    const created: Athlete = {
      ...newAthlete,
      id: `p-${Date.now()}`,
    };
    setAthletes((prev) => [created, ...prev]);
  };

  const handleExportRoster = () => {
    const headers = ["ID", "Name", "Team", "Position", "Number", "Status", "Joined"];
    const rows = filteredAthletes.map((a) => [
      a.id,
      `"${a.name}"`,
      `"${a.team}"`,
      `"${a.position}"`,
      a.number,
      a.status,
      `"${a.joined}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clubsheet_roster_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAthletes = athletes.filter((athlete) => {
    if (teamFilter !== "ALL" && athlete.team !== teamFilter) return false;
    if (statusFilter !== "ALL" && athlete.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        athlete.name.toLowerCase().includes(q) ||
        athlete.position.toLowerCase().includes(q) ||
        String(athlete.number).includes(q)
      );
    }
    return true;
  });

  const activeCount = athletes.filter((a) => a.status === "Active").length;
  const injuredCount = athletes.filter((a) => a.status === "Injured").length;
  const academyCount = athletes.filter((a) => a.team.includes("U17") || a.team.includes("U15") || a.team.includes("U13")).length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Athletes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage athlete rosters, positions, registrations, and club profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportRoster}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            Export Roster
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Athlete
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Total Athletes</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{athletes.length}</p>
          <p className="mt-0.5 text-xs text-primary font-medium">Registered in club</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Active Squad</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{activeCount}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Eligible for selection</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Injured / Out</p>
          <p className="mt-1 text-2xl font-bold text-warning">{injuredCount}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">In medical recovery</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">Academy Youth</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{academyCount}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Development pathways</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs text-card-foreground">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search athletes by name, number..."
            className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="flex-1 sm:flex-initial rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="ALL">All Teams</option>
            <option value="Senior First Team">Senior First Team</option>
            <option value="Under-17 Academy">Under-17 Academy</option>
            <option value="Under-15 Development">Under-15 Development</option>
            <option value="Women’s Senior Team">Women’s Senior Team</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | Athlete["status"])}
            className="flex-1 sm:flex-initial rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            <option value="Active">Active</option>
            <option value="Injured">Injured</option>
            <option value="Pending">Pending Clearance</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Athletes Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs text-card-foreground">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Athlete</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Position</th>
                <th className="py-3 px-4">Number</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredAthletes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No athletes match the selected search or filters.
                  </td>
                </tr>
              ) : (
                filteredAthletes.map((athlete) => (
                  <tr
                    key={athlete.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-xs font-bold text-primary border border-primary/20">
                          {athlete.avatar}
                        </div>
                        <div>
                          <Link
                            href={`/dashboard/athletes/${athlete.id}`}
                            className="font-semibold text-foreground group-hover:text-primary transition-colors"
                          >
                            {athlete.name}
                          </Link>
                          <p className="text-[11px] text-muted-foreground">Joined {athlete.joined}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {athlete.team}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{athlete.position}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center justify-center font-mono font-semibold text-foreground bg-muted rounded-md px-1.5 py-0.5 border border-border">
                        #{athlete.number}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          athlete.status === "Active"
                            ? "bg-primary-subtle text-primary border border-primary/20"
                            : athlete.status === "Injured"
                            ? "bg-warning/10 text-warning border border-warning/20"
                            : athlete.status === "Suspended"
                            ? "bg-danger/10 text-danger border border-danger/20"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {athlete.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/dashboard/athletes/${athlete.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        Profile <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/30 text-xs text-muted-foreground">
          <span>Showing {filteredAthletes.length} of {athletes.length} athletes</span>
        </div>
      </div>

      <AddAthleteModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAddAthlete={handleAddAthlete}
      />
    </div>
  );
}

export default function AthletesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading athletes...</div>}>
      <AthletesContent />
    </Suspense>
  );
}

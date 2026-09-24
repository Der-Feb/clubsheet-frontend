"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  Calendar,
  TrendingUp,
  Search,
} from "lucide-react";
import {
  TakeAttendanceModal,
  type AttendanceEntry,
} from "@/features/attendance/components/take-attendance.modal";

interface AttendanceRecord {
  id: string;
  athleteName: string;
  team: string;
  sessionsAttended: number;
  totalSessions: number;
  percentage: number;
  lastSession: string;
  status: "Excellent" | "Good" | "Needs Attention";
}

const INITIAL_RECORDS: AttendanceRecord[] = [
  {
    id: "att-1",
    athleteName: "John Mugabo",
    team: "Senior First Team",
    sessionsAttended: 16,
    totalSessions: 16,
    percentage: 100,
    lastSession: "Attended (Today)",
    status: "Excellent",
  },
  {
    id: "att-2",
    athleteName: "Claude Habimana",
    team: "Senior First Team",
    sessionsAttended: 15,
    totalSessions: 16,
    percentage: 94,
    lastSession: "Attended (Today)",
    status: "Excellent",
  },
  {
    id: "att-3",
    athleteName: "Eric Nshimiyimana",
    team: "Senior First Team",
    sessionsAttended: 14,
    totalSessions: 16,
    percentage: 88,
    lastSession: "Attended (Today)",
    status: "Good",
  },
  {
    id: "att-4",
    athleteName: "Patrick Bizimana",
    team: "Under-17 Academy",
    sessionsAttended: 14,
    totalSessions: 15,
    percentage: 93,
    lastSession: "Attended (Yesterday)",
    status: "Excellent",
  },
  {
    id: "att-5",
    athleteName: "David Kwizera",
    team: "Under-17 Academy",
    sessionsAttended: 9,
    totalSessions: 15,
    percentage: 60,
    lastSession: "Excused (Medical)",
    status: "Needs Attention",
  },
  {
    id: "att-6",
    athleteName: "Innocent Ruhinda",
    team: "Under-15 Development",
    sessionsAttended: 12,
    totalSessions: 14,
    percentage: 86,
    lastSession: "Attended (Sep 4)",
    status: "Good",
  },
];

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("ALL");
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  const handleSaveAttendance = (
    sessionDate: string,
    team: string,
    entries: AttendanceEntry[]
  ) => {
    setRecords((prev) => {
      const updated = [...prev];
      entries.forEach((entry) => {
        const existingIdx = updated.findIndex((r) => r.id === entry.athleteId || r.athleteName === entry.athleteName);
        if (existingIdx >= 0) {
          const r = updated[existingIdx];
          const newAttended = entry.status === "Attended" ? r.sessionsAttended + 1 : r.sessionsAttended;
          const newTotal = r.totalSessions + 1;
          const newPct = Math.round((newAttended / newTotal) * 100);
          updated[existingIdx] = {
            ...r,
            sessionsAttended: newAttended,
            totalSessions: newTotal,
            percentage: newPct,
            lastSession: `${entry.status} (${sessionDate})`,
            status: newPct >= 90 ? "Excellent" : newPct >= 75 ? "Good" : "Needs Attention",
          };
        } else {
          updated.push({
            id: entry.athleteId,
            athleteName: entry.athleteName,
            team,
            sessionsAttended: entry.status === "Attended" ? 1 : 0,
            totalSessions: 1,
            percentage: entry.status === "Attended" ? 100 : 0,
            lastSession: `${entry.status} (${sessionDate})`,
            status: entry.status === "Attended" ? "Excellent" : "Needs Attention",
          });
        }
      });
      return updated;
    });
  };

  const filteredRecords = records.filter((r) => {
    if (teamFilter !== "ALL" && r.team !== teamFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.athleteName.toLowerCase().includes(q) || r.team.toLowerCase().includes(q);
    }
    return true;
  });

  const athletesForModal = records.map((r) => ({
    id: r.id,
    name: r.athleteName,
    team: r.team,
  }));

  const avgPercentage = records.length > 0
    ? Math.round(records.reduce((sum, r) => sum + r.percentage, 0) / records.length)
    : 87;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Attendance
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor squad session compliance, absence records, and athlete training frequency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAttendanceModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            Take Session Attendance
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs text-card-foreground">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Overall Club Attendance
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">{avgPercentage}%</span>
            <span className="text-xs font-medium text-success flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +2.1%
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Target benchmark: 85%</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs text-card-foreground">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Senior Team Rate
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">94.0%</span>
            <span className="text-xs font-medium text-success flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +3.4%
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Highest compliance squad</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs text-card-foreground">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Youth Academy Rate
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">80.5%</span>
            <span className="text-xs font-medium text-muted-foreground">
              U17 & U15 average
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Medical and school excusals</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs text-card-foreground">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search athlete or squad..."
            className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="flex-1 sm:flex-initial rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="ALL">All Squads</option>
            <option value="Senior First Team">Senior First Team</option>
            <option value="Under-17 Academy">Under-17 Academy</option>
            <option value="Under-15 Development">Under-15 Development</option>
          </select>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs text-card-foreground">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Athlete</th>
                <th className="py-3 px-4">Squad</th>
                <th className="py-3 px-4">Sessions Attended</th>
                <th className="py-3 px-4">Compliance Rate</th>
                <th className="py-3 px-4">Last Status</th>
                <th className="py-3 px-4 text-right">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No attendance records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">{r.athleteName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{r.team}</td>
                    <td className="py-3 px-4 font-mono text-foreground">
                      {r.sessionsAttended} / {r.totalSessions}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              r.percentage >= 90
                                ? "bg-primary"
                                : r.percentage >= 75
                                ? "bg-warning"
                                : "bg-danger"
                            }`}
                            style={{ width: `${r.percentage}%` }}
                          />
                        </div>
                        <span className="font-mono font-semibold text-foreground">
                          {r.percentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{r.lastSession}</td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          r.status === "Excellent"
                            ? "bg-primary-subtle text-primary border border-primary/20"
                            : r.status === "Good"
                            ? "bg-success/10 text-success border border-success/20"
                            : "bg-danger/10 text-danger border border-danger/20"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TakeAttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        athletes={athletesForModal}
        onSaveAttendance={handleSaveAttendance}
      />
    </div>
  );
}

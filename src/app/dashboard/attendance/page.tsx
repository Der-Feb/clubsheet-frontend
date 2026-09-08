import {
  ClipboardCheck,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface AttendanceRecord {
  id: string;
  playerName: string;
  team: string;
  sessionsAttended: number;
  totalSessions: number;
  percentage: number;
  lastSession: string;
  status: "Excellent" | "Good" | "Needs Attention";
}

const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: "att-1",
    playerName: "John Mugabo",
    team: "Senior First Team",
    sessionsAttended: 16,
    totalSessions: 16,
    percentage: 100,
    lastSession: "Attended (Today)",
    status: "Excellent",
  },
  {
    id: "att-2",
    playerName: "Claude Habimana",
    team: "Senior First Team",
    sessionsAttended: 15,
    totalSessions: 16,
    percentage: 94,
    lastSession: "Attended (Today)",
    status: "Excellent",
  },
  {
    id: "att-3",
    playerName: "Eric Nshimiyimana",
    team: "Senior First Team",
    sessionsAttended: 14,
    totalSessions: 16,
    percentage: 88,
    lastSession: "Attended (Today)",
    status: "Good",
  },
  {
    id: "att-4",
    playerName: "Patrick Bizimana",
    team: "Under-17 Academy",
    sessionsAttended: 14,
    totalSessions: 15,
    percentage: 93,
    lastSession: "Attended (Yesterday)",
    status: "Excellent",
  },
  {
    id: "att-5",
    playerName: "David Kwizera",
    team: "Under-17 Academy",
    sessionsAttended: 9,
    totalSessions: 15,
    percentage: 60,
    lastSession: "Excused (Medical)",
    status: "Needs Attention",
  },
  {
    id: "att-6",
    playerName: "Innocent Ruhinda",
    team: "Under-15 Development",
    sessionsAttended: 12,
    totalSessions: 14,
    percentage: 86,
    lastSession: "Attended (Sep 4)",
    status: "Good",
  },
];

export default function AttendancePage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Attendance
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor squad session compliance, absence records, and player training frequency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Last 30 Days
          </button>
          <button
            type="button"
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
            <span className="text-3xl font-bold text-primary">87.4%</span>
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
            <span className="text-3xl font-bold text-foreground">92.0%</span>
            <span className="text-xs font-medium text-muted-foreground">16 sessions</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Highest compliance squad</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs text-card-foreground">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Active Absences / Medical
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-warning">4 Players</span>
            <span className="text-xs font-medium text-warning">Excused</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Under certified recovery</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs text-card-foreground">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">
            Player Attendance Performance
          </h2>
          <span className="text-xs text-muted-foreground">September 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Completed / Total</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Last Session</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {ATTENDANCE_RECORDS.map((record) => (
                <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-foreground">
                    {record.playerName}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{record.team}</td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">
                    {record.sessionsAttended} / {record.totalSessions}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            record.percentage >= 90
                              ? "bg-primary"
                              : record.percentage >= 80
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                          style={{ width: `${record.percentage}%` }}
                        />
                      </div>
                      <span className="font-semibold text-foreground">
                        {record.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{record.lastSession}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        record.status === "Excellent"
                          ? "bg-primary-subtle text-primary border border-primary/20"
                          : record.status === "Good"
                          ? "bg-info/10 text-info border border-info/20"
                          : "bg-warning/10 text-warning border border-warning/20"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

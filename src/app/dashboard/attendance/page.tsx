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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Attendance
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Monitor squad session compliance, absence records, and player training frequency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs"
          >
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            Last 30 Days
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#005F31] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#01562D] shadow-xs"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            Take Session Attendance
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-zinc-400 uppercase">
            Overall Club Attendance
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#005F31]">87.4%</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +2.1%
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">Target benchmark: 85%</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-zinc-400 uppercase">
            Senior Team Rate
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900">92.0%</span>
            <span className="text-xs font-medium text-zinc-400">16 sessions</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">Highest compliance squad</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold text-zinc-400 uppercase">
            Active Absences / Medical
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-600">4 Players</span>
            <span className="text-xs font-medium text-amber-700">Excused</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">Under certified recovery</p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900">
            Player Attendance Performance
          </h2>
          <span className="text-xs text-zinc-400">September 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/75 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Completed / Total</th>
                <th className="py-3 px-4">Attendance %</th>
                <th className="py-3 px-4">Last Session</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {ATTENDANCE_RECORDS.map((record) => (
                <tr key={record.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-zinc-900">
                    {record.playerName}
                  </td>
                  <td className="py-3 px-4 text-zinc-600">{record.team}</td>
                  <td className="py-3 px-4 font-mono text-zinc-600">
                    {record.sessionsAttended} / {record.totalSessions}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-zinc-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            record.percentage >= 90
                              ? "bg-[#005F31]"
                              : record.percentage >= 80
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${record.percentage}%` }}
                        />
                      </div>
                      <span className="font-semibold text-zinc-800">
                        {record.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-zinc-500">{record.lastSession}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        record.status === "Excellent"
                          ? "bg-emerald-50 text-[#005F31]"
                          : record.status === "Good"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
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

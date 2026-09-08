import {
  BarChart3,
  Calendar,
  Download,
  Users,
  ClipboardCheck,
  Trophy,
  Dumbbell,
} from "lucide-react";

interface ReportCard {
  title: string;
  category: string;
  description: string;
  period: string;
  status: string;
  icon: typeof BarChart3;
}

const REPORTS: ReportCard[] = [
  {
    title: "Player Registration & Squad Demographics",
    category: "Club Roster",
    description:
      "Comprehensive breakdown of player ages, contract terms, national registrations, and academy transitions.",
    period: "2026/27 Season",
    status: "Ready to export",
    icon: Users,
  },
  {
    title: "Monthly Training Attendance & Compliance",
    category: "Technical",
    description:
      "Full squad session frequency, absence reasons, medical leaves, and individual participation benchmarks.",
    period: "August 2026",
    status: "Ready to export",
    icon: ClipboardCheck,
  },
  {
    title: "Matchday Performance & Squad Analytics",
    category: "Competition",
    description:
      "Goals scored, clean sheets, disciplinary records, starting eleven appearances, and substitution logs.",
    period: "Matchdays 1-13",
    status: "Ready to export",
    icon: Trophy,
  },
  {
    title: "Medical & Rehabilitation Progress Report",
    category: "Health & Fitness",
    description:
      "Player recovery timelines, injury occurrences by pitch type, physio discharge records, and wellness scores.",
    period: "Q3 2026",
    status: "Ready to export",
    icon: Dumbbell,
  },
];

export default function ReportsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Reports
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Export official analytics, compliance sheets, and squad performance summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs"
          >
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            Select Custom Range
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.title}
              className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-zinc-300 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
                    {report.category}
                  </span>
                  <span className="text-xs text-zinc-400">{report.period}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#005F31]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">
                      {report.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  {report.status}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    <Download className="h-3 w-3 text-zinc-400" />
                    CSV
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-md bg-[#005F31] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#01562D] transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    PDF
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

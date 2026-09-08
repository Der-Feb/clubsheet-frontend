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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Reports
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Export official analytics, compliance sheets, and squad performance summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
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
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 transition-all space-y-4 text-card-foreground"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground border border-border">
                    {report.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{report.period}</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary border border-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {report.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] font-medium text-success flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  {report.status}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Download className="h-3 w-3 text-muted-foreground" />
                    CSV
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer"
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

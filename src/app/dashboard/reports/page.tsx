"use client";

import { useState } from "react";
import {
  BarChart3,
  Calendar,
  Download,
  Users,
  ClipboardCheck,
  Trophy,
  Dumbbell,
  CheckCircle2,
} from "lucide-react";
import { DateRangeModal } from "@/features/reports/components/date-range.modal";

interface ReportCard {
  title: string;
  category: string;
  description: string;
  period: string;
  status: string;
  icon: typeof BarChart3;
}

const INITIAL_REPORTS: ReportCard[] = [
  {
    title: "Athlete Registration & Squad Demographics",
    category: "Club Roster",
    description:
      "Comprehensive breakdown of athlete ages, contract terms, national registrations, and academy transitions.",
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
      "Athlete recovery timelines, injury occurrences by pitch type, physio discharge records, and wellness scores.",
    period: "Q3 2026",
    status: "Ready to export",
    icon: Dumbbell,
  },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportCard[]>(INITIAL_REPORTS);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-09-30");
  const [customPeriodLabel, setCustomPeriodLabel] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleApplyRange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    const label = `${start} to ${end}`;
    setCustomPeriodLabel(label);
    setReports((prev) =>
      prev.map((r) => ({
        ...r,
        period: label,
      }))
    );
  };

  const handleExport = (reportTitle: string, format: "CSV" | "PDF") => {
    const filename = `${reportTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${format.toLowerCase()}`;
    const sampleData = `Report: ${reportTitle}\nPeriod: ${customPeriodLabel || "Standard Season"}\nGenerated: ${new Date().toISOString()}\nStatus: Official Clubsheet Verified`;
    
    const blob = new Blob([sampleData], { type: format === "CSV" ? "text/csv" : "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Exported ${filename}`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

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
          {customPeriodLabel && (
            <button
              type="button"
              onClick={() => {
                setCustomPeriodLabel(null);
                setReports(INITIAL_REPORTS);
              }}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Reset range
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsDateModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            {customPeriodLabel ? customPeriodLabel : "Select Custom Range"}
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-success/10 border border-success/20 p-3 text-xs text-success font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4" />
          {downloadSuccess}
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => {
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
                  <span className="text-xs text-muted-foreground font-medium">{report.period}</span>
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
                    onClick={() => handleExport(report.title, "CSV")}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Download className="h-3 w-3 text-muted-foreground" />
                    CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport(report.title, "PDF")}
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

      <DateRangeModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        startDate={startDate}
        endDate={endDate}
        onApplyRange={handleApplyRange}
      />
    </div>
  );
}

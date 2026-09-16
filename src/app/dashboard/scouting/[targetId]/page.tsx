"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  ArrowRightCircle,
  UserX,
  FilePlus,
  Calendar,
  DollarSign,
  User,
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  useScoutingTarget,
  useAddScoutingReport,
  useUpdateScoutingStatus,
  useOpenTransfer,
} from "@/hooks/use-scouting.hook";
import type {
  ScoutingAttribute,
  ScoutingStatus,
  ScoutingReport,
} from "@/types/scouting.types";
import { AddScoutingReportModal } from "@/features/scouting/components/add-report.modal";

export default function ScoutingTargetDetailPage() {
  const params = useParams();
  const targetId = params.targetId as string;

  const { data: target, isLoading } = useScoutingTarget(targetId);
  const addReportMutation = useAddScoutingReport();
  const updateStatusMutation = useUpdateScoutingStatus();
  const openTransferMutation = useOpenTransfer();

  const [activeTab, setActiveTab] = useState<"attributes" | "reports" | "transfer">("attributes");
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-xs text-muted-foreground">
        Loading prospect profile...
      </div>
    );
  }

  if (!target) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/scouting"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Scouting Watchlist
        </Link>
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-base font-semibold text-foreground">Target Not Found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            The scouting target you are looking for does not exist or was removed.
          </p>
        </div>
      </div>
    );
  }

  const reports = target.reports || [];
  const latestReport = reports[0];
  const rating = target.latestRating ?? latestReport?.overallRating;

  const attributeLabels: Record<ScoutingAttribute, string> = {
    PACE: "Pace (PAC)",
    SHOOTING: "Shooting (SHO)",
    PASSING: "Passing (PAS)",
    DRIBBLING: "Dribbling (DRI)",
    DEFENDING: "Defending (DEF)",
    PHYSICAL: "Physical (PHY)",
  };

  const getAttrScore = (report: ScoutingReport | undefined, attr: ScoutingAttribute): number => {
    if (!report?.attributes) return 0;
    const found = report.attributes.find((a) => a.attribute === attr);
    return found ? found.value : 0;
  };

  const getRatingColorClass = (score: number) => {
    if (score >= 80) return "bg-emerald-500 text-emerald-500";
    if (score >= 70) return "bg-primary text-primary";
    if (score >= 60) return "bg-amber-500 text-amber-500";
    return "bg-rose-500 text-rose-500";
  };

  const getStatusBadge = (status: ScoutingStatus) => {
    switch (status) {
      case "WATCHING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 border border-amber-500/20">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Watching (Under Evaluation)
          </span>
        );
      case "SHORTLISTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            Shortlisted (Target Priority)
          </span>
        );
      case "TRANSFER_OPENED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500 border border-emerald-500/20">
            <ArrowRightCircle className="h-3.5 w-3.5 text-emerald-500" />
            Transfer Opened
          </span>
        );
      case "DROPPED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground border border-border">
            Dropped Prospect
          </span>
        );
    }
  };

  const handleAddReportSubmit = (reportData: {
    position: string;
    estimatedValue: number;
    notes: string;
    attributes: Record<ScoutingAttribute, number>;
  }) => {
    addReportMutation.mutate(
      {
        targetId: target.id,
        ...reportData,
      },
      {
        onSuccess: () => {
          setIsAddReportModalOpen(false);
        },
      }
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation */}
      <Link
        href="/dashboard/scouting"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Scouting Watchlist
      </Link>

      {/* Prospect Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-xl border border-primary/20">
              {target.externalName.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{target.externalName}</h1>
                {getStatusBadge(target.status)}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {target.primaryPosition} &bull; Currently at{" "}
                <span className="text-foreground font-semibold">{target.currentClub || "Free Agent / Unknown"}</span>
              </p>
              <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                  Market Value:{" "}
                  <strong className="text-foreground">
                    {latestReport?.estimatedValue
                      ? `$${latestReport.estimatedValue.toLocaleString()}`
                      : "Unvalued"}
                  </strong>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Reports Filed: <strong className="text-foreground">{reports.length}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Rating Badge & Header Actions */}
          <div className="flex flex-col items-start lg:items-end gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Overall Rating (1–99)
                </p>
                <div className="mt-0.5 inline-flex items-center gap-1 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-1 text-lg font-black text-primary">
                  {rating ? `${rating} / 99` : "N/A"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsAddReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
              >
                <FilePlus className="h-4 w-4" />
                Add Scout Report
              </button>

              {target.status === "WATCHING" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatusMutation.mutate({
                      targetId: target.id,
                      status: "SHORTLISTED",
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-500 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  Shortlist Target
                </button>
              )}

              {target.status === "SHORTLISTED" && (
                <button
                  type="button"
                  onClick={() => openTransferMutation.mutate(target.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-600 shadow-xs transition-colors cursor-pointer"
                >
                  <ArrowRightCircle className="h-4 w-4" />
                  Open Transfer
                </button>
              )}

              {target.status !== "DROPPED" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatusMutation.mutate({
                      targetId: target.id,
                      status: "DROPPED",
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <UserX className="h-4 w-4" />
                  Drop Target
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("attributes")}
            className={`pb-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === "attributes"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Profile & Attributes (1–99)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`pb-3 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === "reports"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Scout Evaluation Reports
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-foreground">
              {reports.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("transfer")}
            className={`pb-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === "transfer"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Transfer Status & Workflow
          </button>
        </nav>
      </div>

      {/* Tab 1: Profile & Attributes */}
      {activeTab === "attributes" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attributes breakdown */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Attribute Ratings breakdown</h3>
                <p className="text-xs text-muted-foreground">
                  Evaluated on a 1–99 standard rating scale based on scouting reports.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Activity className="h-4 w-4 text-primary" />
                Latest Rating: <strong className="text-foreground">{rating || "N/A"}</strong>
              </div>
            </div>

            {latestReport ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(attributeLabels) as ScoutingAttribute[]).map((attr) => {
                  const score = getAttrScore(latestReport, attr);
                  const colorClass = getRatingColorClass(score);
                  return (
                    <div
                      key={attr}
                      className="rounded-xl border border-border bg-muted/20 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">
                          {attributeLabels[attr]}
                        </span>
                        <span className={`font-black text-sm ${colorClass.split(" ")[1]}`}>
                          {score} / 99
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            colorClass.split(" ")[0]
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No evaluation reports filed yet. Click "Add Scout Report" to enter ratings.
              </div>
            )}

            {/* Latest Scout Notes */}
            {latestReport?.notes && (
              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  Scout Comments ({latestReport.scoutName})
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  "{latestReport.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Quick Info Sidebar */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-3">
              Prospect Details
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground">Full Name:</span>
                <p className="font-semibold text-foreground">{target.externalName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Primary Position:</span>
                <p className="font-semibold text-foreground">{target.primaryPosition}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Current Club:</span>
                <p className="font-semibold text-foreground">{target.currentClub || "Free Agent / Unknown"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Estimated Market Value:</span>
                <p className="font-bold text-emerald-500">
                  {latestReport?.estimatedValue
                    ? `$${latestReport.estimatedValue.toLocaleString()}`
                    : "Not Valued"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Current Scouting Status:</span>
                <div className="mt-1">{getStatusBadge(target.status)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Scout Reports Timeline */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Scouting Evaluation History</h3>
            <button
              type="button"
              onClick={() => setIsAddReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              <FilePlus className="h-3.5 w-3.5" />
              File New Report
            </button>
          </div>

          {reports.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center text-xs text-muted-foreground">
              No scout reports submitted for this target yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{report.scoutName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Evaluated as {report.position}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-emerald-500 font-bold">
                        Est. Val: ${report.estimatedValue.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Attribute Badges */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {(Object.keys(attributeLabels) as ScoutingAttribute[]).map((attr) => {
                      const score = getAttrScore(report, attr);
                      return (
                        <div
                          key={attr}
                          className="rounded-xl border border-border bg-muted/30 p-2 text-center"
                        >
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                            {attr}
                          </p>
                          <p className="text-xs font-black text-foreground mt-0.5">
                            {score} <span className="text-[10px] text-muted-foreground">/99</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Scout Notes */}
                  {report.notes && (
                    <p className="text-xs text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-xl border border-border">
                      {report.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Transfer Status & Workflow */}
      {activeTab === "transfer" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-foreground">Transfer Acquisition Workflow</h3>
            <p className="text-xs text-muted-foreground">
              Track progression from initial scouting watchlist to formal transfer negotiations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Watching */}
            <div
              className={`rounded-2xl border p-4 space-y-2 ${
                target.status === "WATCHING"
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-border bg-muted/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">1. Watching</span>
                {target.status === "WATCHING" ? (
                  <Clock className="h-4 w-4 text-amber-500" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Target is actively being observed by scouting department staff.
              </p>
            </div>

            {/* Step 2: Shortlisted */}
            <div
              className={`rounded-2xl border p-4 space-y-2 ${
                target.status === "SHORTLISTED"
                  ? "border-primary/40 bg-primary/5"
                  : target.status === "TRANSFER_OPENED"
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-border bg-muted/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">2. Shortlisted</span>
                {target.status === "SHORTLISTED" ? (
                  <Clock className="h-4 w-4 text-primary" />
                ) : target.status === "TRANSFER_OPENED" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                High priority target selected for potential squad reinforcement.
              </p>
            </div>

            {/* Step 3: Transfer Opened */}
            <div
              className={`rounded-2xl border p-4 space-y-2 ${
                target.status === "TRANSFER_OPENED"
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-border bg-muted/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">3. Transfer Opened</span>
                {target.status === "TRANSFER_OPENED" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Formal transfer inquiry or contract negotiation initiated.
              </p>
            </div>
          </div>

          {/* Transfer Action Box */}
          {target.status === "SHORTLISTED" && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-3">
              <h4 className="text-xs font-bold text-emerald-500 flex items-center gap-2">
                <ArrowRightCircle className="h-4 w-4" />
                Ready for Transfer Inquiry
              </h4>
              <p className="text-xs text-muted-foreground">
                This target is shortlisted and validated with scouting reports. You can now open a formal transfer process.
              </p>
              <button
                type="button"
                onClick={() => openTransferMutation.mutate(target.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                Open Transfer Process
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Report Modal */}
      <AddScoutingReportModal
        isOpen={isAddReportModalOpen}
        onClose={() => setIsAddReportModalOpen(false)}
        targetName={target.externalName}
        defaultPosition={target.primaryPosition}
        onAddReport={handleAddReportSubmit}
        isLoading={addReportMutation.isPending}
      />
    </div>
  );
}

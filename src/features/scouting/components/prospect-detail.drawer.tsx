"use client";

import { useEffect } from "react";
import {
  X,
  Target,
  FilePlus,
  Star,
  ArrowRightCircle,
  UserX,
  ArrowRight,
  DollarSign,
  Calendar,
  User,
} from "lucide-react";
import type { ScoutingTarget, ScoutingAttribute } from "@/types/scouting.types";
import Link from "next/link";

interface ProspectDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  target: ScoutingTarget | null;
  onAddReportClick: () => void;
  onShortlist: () => void;
  onOpenTransfer: () => void;
  onDrop: () => void;
}

export function ProspectDetailDrawer({
  isOpen,
  onClose,
  target,
  onAddReportClick,
  onShortlist,
  onOpenTransfer,
  onDrop,
}: ProspectDetailDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !target) return null;

  const reports = target.reports || [];
  const latestReport = reports[0];
  const isShortlisted = target.status === "SHORTLISTED";
  const isTransferOpened = target.status === "TRANSFER_OPENED";
  const isDropped = target.status === "DROPPED";

  // Attribute labels
  const attributeLabels: Record<ScoutingAttribute, string> = {
    PACE: "Pace",
    SHOOTING: "Shooting",
    PASSING: "Passing",
    DRIBBLING: "Dribbling",
    DEFENDING: "Defending",
    PHYSICAL: "Physical",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex w-full max-w-md pl-4 sm:pl-10">
        {/* Drawer Panel */}
        <div className="w-full bg-card border-l border-border shadow-2xl text-card-foreground animate-in slide-in-from-right duration-250 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-base font-bold text-primary">
                {target.externalName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {target.externalName}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      target.status === "SHORTLISTED"
                        ? "bg-primary-subtle text-primary border border-primary/20"
                        : target.status === "TRANSFER_OPENED"
                        ? "bg-warning/10 text-warning border border-warning/20"
                        : target.status === "WATCHING"
                        ? "bg-info/10 text-info border border-info/20"
                        : "bg-danger/10 text-danger border border-danger/20"
                    }`}
                  >
                    {target.status.replace("_", " ")}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {target.primaryPosition}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Rating & Market Value Overview */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl border border-border bg-card shadow-xs">
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Overall Rating
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-primary">
                    {target.latestRating !== undefined && target.latestRating !== null
                      ? target.latestRating
                      : "N/A"}
                  </span>
                  {target.latestRating !== undefined && target.latestRating !== null && (
                    <span className="text-xs text-muted-foreground">/ 99</span>
                  )}
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Est. Market Value
                </p>
                <p className="text-lg font-bold text-foreground flex items-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  {latestReport !== undefined && latestReport?.estimatedValue !== undefined
                    ? latestReport.estimatedValue.toLocaleString()
                    : "Unvalued"}
                </p>
              </div>
            </div>

            {/* Current Club & Scout Meta */}
            <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-foreground">
                <span className="text-muted-foreground">Current Club:</span>
                <span className="font-semibold">{target.currentClub || "Free Agent"}</span>
              </div>
              <div className="flex items-center justify-between text-foreground">
                <span className="text-muted-foreground">Added By:</span>
                <span className="font-medium">{target.addedByName}</span>
              </div>
              <div className="flex items-center justify-between text-foreground">
                <span className="text-muted-foreground">Date Added:</span>
                <span className="text-muted-foreground">{target.createdAt}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onAddReportClick}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover transition-colors cursor-pointer shadow-xs"
              >
                <FilePlus className="h-3.5 w-3.5" />
                Add Report
              </button>

              {!isShortlisted && !isTransferOpened && (
                <button
                  type="button"
                  onClick={onShortlist}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <Star className="h-3.5 w-3.5 text-warning" />
                  Shortlist
                </button>
              )}

              {isShortlisted && (
                <button
                  type="button"
                  onClick={onOpenTransfer}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary-subtle px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  <ArrowRightCircle className="h-3.5 w-3.5 text-primary" />
                  Open Transfer
                </button>
              )}

              {!isDropped && (
                <button
                  type="button"
                  onClick={onDrop}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-xs font-medium text-danger hover:bg-danger/20 transition-colors cursor-pointer"
                >
                  <UserX className="h-3.5 w-3.5" />
                  Drop
                </button>
              )}
            </div>

            {/* 1-99 Attribute Breakdown (Most Recent Report) */}
            {latestReport && (
              <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
                  <span>Attribute Breakdown</span>
                  <span className="text-[11px] font-normal text-muted-foreground">
                    Scale 1 - 99
                  </span>
                </h3>

                <div className="space-y-2.5 pt-1">
                  {latestReport.attributes.map((attr) => (
                    <div key={attr.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-foreground">
                          {attributeLabels[attr.attribute]}
                        </span>
                        <span className="font-bold text-primary">
                          {attr.value} / 99
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(5, attr.value))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Scouting Reports History */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Evaluation History ({reports.length} Reports)
              </h3>

              <div className="space-y-3 pt-1">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="rounded-xl border border-border bg-muted/30 p-3 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <div className="flex items-center gap-1.5 text-foreground font-semibold">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{rep.scoutName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-primary text-primary-foreground px-2 py-0.5 font-bold text-[11px]">
                          {rep.overallRating} / 99
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {rep.createdAt}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      {rep.notes}
                    </p>
                  </div>
                ))}

                {reports.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">
                    No scouting reports filed yet. Click &quot;Add Report&quot; above to submit an evaluation.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Drawer Footer with Link to Full Prospect Page */}
          <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Close
            </button>

            <Link
              href={`/dashboard/scouting/${target.id}`}
              replace
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              <span>View Full Prospect Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

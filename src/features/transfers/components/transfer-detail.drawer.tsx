"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  X,
  ArrowRight,
  DollarSign,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileSignature,
  Target,
  MessageSquare,
  Send,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  AlertTriangle,
  FileText,
  Activity,
  ShieldAlert,
  Plus,
} from "lucide-react";
import type {
  Transfer,
  TransferStatus,
  MedicalExamStatus,
  FindingSeverity,
  MedicalFinding,
} from "@/types/transfers.types";

interface TransferDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: Transfer | null;
  onCounterOffer?: (data: {
    transferId: string;
    feeAmount: number;
    terms?: string;
    notes?: string;
  }) => void;
  onCounterBasedOnFinding?: (data: {
    transferId: string;
    findingId: string;
    findingCondition: string;
    feeAmount: number;
    terms?: string;
    notes?: string;
  }) => void;
  onAccept?: (transferId: string) => void;
  onScheduleMedical?: (transferId: string) => void;
  onPassMedical?: (transferId: string) => void;
  onRecordFinding?: (data: {
    transferId: string;
    condition: string;
    severity: FindingSeverity;
    note: string;
    disqualifying: boolean;
  }) => void;
  onReject?: (transferId: string) => void;
  onWithdraw?: (transferId: string) => void;
  isSubmitting?: boolean;
}

const STATUS_BADGE: Record<TransferStatus, { label: string; style: string; dot: string }> = {
  OPEN: {
    label: "Open Bid",
    style: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    dot: "bg-blue-500",
  },
  COUNTERED: {
    label: "Countered",
    style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
  },
  TERMS_AGREED: {
    label: "Terms Agreed (Pending Medical)",
    style: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30",
    dot: "bg-teal-500",
  },
  MEDICAL_SCHEDULED: {
    label: "Medical Scheduled",
    style: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
    dot: "bg-sky-500",
  },
  MEDICAL_FLAGGED: {
    label: "Medical Flagged",
    style: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
    dot: "bg-orange-500",
  },
  ACCEPTED: {
    label: "Accepted",
    style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  DISQUALIFIED: {
    label: "Disqualified",
    style: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30",
    dot: "bg-zinc-500",
  },
  REJECTED: {
    label: "Rejected",
    style: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    dot: "bg-rose-500",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    style: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
};

const EXAM_STATUS_BADGE: Record<MedicalExamStatus, { label: string; style: string }> = {
  SCHEDULED: {
    label: "Scheduled",
    style: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
  },
  PASSED: {
    label: "Passed / Clear",
    style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  FLAGGED: {
    label: "Findings Flagged",
    style: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
  FAILED: {
    label: "Failed / Disqualifying",
    style: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30",
  },
};

const SEVERITY_BADGE: Record<FindingSeverity, { label: string; style: string }> = {
  MINOR: {
    label: "Minor",
    style: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  MODERATE: {
    label: "Moderate",
    style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  SEVERE: {
    label: "Severe",
    style: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
};

export function TransferDetailDrawer({
  isOpen,
  onClose,
  transfer,
  onCounterOffer,
  onCounterBasedOnFinding,
  onAccept,
  onScheduleMedical,
  onPassMedical,
  onRecordFinding,
  onReject,
  onWithdraw,
  isSubmitting = false,
}: TransferDetailDrawerProps) {
  const router = useRouter();
  // Inline counter form state
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterFee, setCounterFee] = useState<number>(0);
  const [counterTerms, setCounterTerms] = useState("");
  const [counterNotes, setCounterNotes] = useState("");
  const [citedFinding, setCitedFinding] = useState<{ id: string; condition: string } | null>(null);

  // History visibility & collapsible states
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [expandedOfferIds, setExpandedOfferIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (transfer) {
      setCounterFee(transfer.currentOfferFee);
      setCounterTerms("");
      setCounterNotes("");
      setShowCounterForm(false);
      setCitedFinding(null);
      setShowAllHistory(false);
      // By default expand the latest offer
      if (transfer.negotiationHistory.length > 0) {
        const lastId = transfer.negotiationHistory[transfer.negotiationHistory.length - 1].id;
        setExpandedOfferIds({ [lastId]: true });
      }
    }
  }, [transfer]);

  if (!isOpen || !transfer) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatSeverity = (severity: string) => {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-1 py-0.5 text-[8px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
        {severity}
      </span>
    );
  };

  const handleSubmitCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterFee) return;

    if (citedFinding && onCounterBasedOnFinding) {
      onCounterBasedOnFinding({
        transferId: transfer.id,
        findingId: citedFinding.id,
        findingCondition: citedFinding.condition,
        feeAmount: Number(counterFee),
        terms: counterTerms.trim() || undefined,
        notes: counterNotes.trim() || undefined,
      });
    } else if (onCounterOffer) {
      onCounterOffer({
        transferId: transfer.id,
        feeAmount: Number(counterFee),
        terms: counterTerms.trim() || undefined,
        notes: counterNotes.trim() || undefined,
      });
    }
    setShowCounterForm(false);
    setCitedFinding(null);
  };

  const handleStartFindingCounter = (finding: MedicalFinding) => {
    setCitedFinding({ id: finding.id, condition: finding.condition });
    setCounterFee(Math.round(transfer.currentOfferFee * 0.9)); // suggest adjusted fee
    setCounterTerms(`Adjusted terms citing ${finding.condition}`);
    setCounterNotes(`Offer adjusted citing clinical finding: ${finding.condition}`);
    setShowCounterForm(true);
  };

  const toggleOfferExpand = (id: string) => {
    setExpandedOfferIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isTerminal =
    transfer.status === "ACCEPTED" ||
    transfer.status === "DISQUALIFIED" ||
    transfer.status === "REJECTED" ||
    transfer.status === "WITHDRAWN";

  const isNegotiationActive =
    transfer.status === "OPEN" ||
    transfer.status === "COUNTERED" ||
    transfer.status === "MEDICAL_FLAGGED";

  const canPassMedical =
    transfer.status === "MEDICAL_SCHEDULED" &&
    (transfer.medicalExam?.findings.length ?? 0) === 0;

  // In modal/drawer, show 2 latest offers by default unless showAllHistory is true
  const visibleOffers = showAllHistory
    ? transfer.negotiationHistory
    : transfer.negotiationHistory.slice(-2);

  const hiddenCount = transfer.negotiationHistory.length - 2;

  const disqualifyingFinding = transfer.medicalExam?.findings.find((f) => f.disqualifying);

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
          {/* Drawer Header */}
          <div className="p-6 border-b border-border bg-muted/20 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-sm font-bold text-primary">
                  {transfer.athleteName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    {transfer.athleteName}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {transfer.athletePosition || "Athlete"}
                  </p>
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

            {/* From Club -> To Club Flow & Status Badge */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-foreground">
                  {transfer.fromClubName}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-semibold text-foreground">
                  {transfer.toClubName}
                </span>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                  STATUS_BADGE[transfer.status]?.style || STATUS_BADGE.OPEN.style
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    STATUS_BADGE[transfer.status]?.dot || STATUS_BADGE.OPEN.dot
                  }`}
                />
                {STATUS_BADGE[transfer.status]?.label || transfer.status}
              </span>
            </div>
          </div>

          {/* Drawer Body - Negotiation Thread */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Resolution Banner: ACCEPTED */}
            {transfer.status === "ACCEPTED" && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-400 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Medical cleared — transfer accepted, signing created</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-700/90 dark:text-emerald-300">
                  Medical review passed cleanly. Transfer accepted and an official Signing contract was created for {transfer.athleteName}.
                </p>
                {transfer.signingId && (
                  <div className="pt-1">
                    <Link
                      href={`/dashboard/signings/${transfer.signingId}`}
                      replace
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
                    >
                      <FileSignature className="h-3.5 w-3.5" />
                      <span>View Resulting Signing Record</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Resolution Banner: DISQUALIFIED */}
            {transfer.status === "DISQUALIFIED" && (
              <div className="rounded-2xl border border-border bg-muted/40 p-4 text-foreground space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-xs text-muted-foreground">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>Transfer ended — disqualifying medical finding</span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Clinical review discovered a disqualifying finding:{" "}
                  <strong className="text-foreground">
                    {disqualifyingFinding?.condition || "Disqualifying Medical Condition"}
                  </strong>
                  . The negotiation is terminated and the linked scouting record has been updated to Dropped.
                </p>
              </div>
            )}

            {/* In-Progress Banner: TERMS_AGREED / MEDICAL_SCHEDULED */}
            {(transfer.status === "TERMS_AGREED" || transfer.status === "MEDICAL_SCHEDULED") && (
              <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-teal-700 dark:text-teal-400">
                  <Stethoscope className="h-4 w-4 shrink-0 text-teal-500" />
                  <span>Terms Agreed — Medical Review Stage Active</span>
                </div>
                <p className="text-[11px] text-teal-700/80 dark:text-teal-300/80 leading-relaxed">
                  Financial terms agreed between clubs. Athlete is scheduled for comprehensive physical and clinical screening.
                </p>
              </div>
            )}

            {/* Negotiation History Thread */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  Negotiation Thread ({transfer.negotiationHistory.length})
                </h3>

                {hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAllHistory(!showAllHistory)}
                    className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {showAllHistory
                      ? "Show latest 2 only"
                      : `Show all (${transfer.negotiationHistory.length})`}
                  </button>
                )}
              </div>

              {/* Scrollable Container for overflowing thread history */}
              <div className="max-h-96 overflow-y-auto space-y-3 relative pr-1 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {visibleOffers.map((offer) => {
                  const isExpanded = expandedOfferIds[offer.id] ?? false;

                  return (
                    <div key={offer.id} className="relative pl-9">
                      {/* Enlarged Dot on timeline */}
                      <button
                        type="button"
                        onClick={() => toggleOfferExpand(offer.id)}
                        className={`absolute left-4 top-4 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-card shadow-xs transition-transform cursor-pointer hover:scale-110 ${
                          offer.isCounter ? "bg-amber-500" : "bg-primary"
                        }`}
                        title={isExpanded ? "Collapse item" : "Expand item"}
                      />

                      {/* Collapsible Chat Bubble */}
                      <div
                        className={`rounded-2xl border transition-all text-xs shadow-xs overflow-hidden ${
                          offer.isCounter
                            ? "border-amber-500/30 bg-amber-500/5"
                            : "border-border bg-card"
                        }`}
                      >
                        {/* Collapsible Header */}
                        <div
                          onClick={() => toggleOfferExpand(offer.id)}
                          className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-foreground">
                              {offer.clubName}
                            </span>
                            {offer.isCounter ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                <CornerDownRight className="h-3 w-3" />
                                Counter
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                                Opening Offer
                              </span>
                            )}

                            {/* Cites Finding Chip */}
                            {offer.citesFindingCondition && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                <Activity className="h-3 w-3" />
                                Cites: {offer.citesFindingCondition}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">
                              {formatCurrency(offer.feeAmount)}
                            </span>
                            <span className="text-muted-foreground p-0.5 rounded hover:bg-muted">
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Collapsible Body */}
                        {isExpanded && (
                          <div className="p-3.5 pt-0 border-t border-border/40 space-y-2 animate-in fade-in duration-150">
                            <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1">
                              <span>Submitted:</span>
                              <span>{offer.createdAt}</span>
                            </div>

                            {offer.terms && (
                              <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5 text-[11px]">
                                <span className="font-semibold text-muted-foreground block text-[10px] uppercase">
                                  Key Terms
                                </span>
                                <span className="text-foreground">{offer.terms}</span>
                              </div>
                            )}

                            {offer.notes && (
                              <div className="rounded-xl border border-border bg-card p-2.5 text-[11px] text-foreground space-y-1">
                                <span className="font-semibold text-muted-foreground text-[10px] uppercase flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3 text-primary" />
                                  Negotiation Comment
                                </span>
                                <p className="italic text-foreground/90">"{offer.notes}"</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Medical Review Event Card in Thread (Outlined Neutral Card, distinct from bubble) */}
                {transfer.medicalExam && (
                  <div className="relative pl-9 pt-1">
                    {/* Medical Timeline Dot */}
                    <div className="absolute left-4 top-5 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-card bg-teal-500 shadow-xs" />

                    <div className="rounded-2xl border-2 border-border bg-muted/20 p-4 space-y-3 text-xs shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                          <h4 className="font-bold text-foreground">
                            Medical Examination
                          </h4>
                        </div>
                        <Link
                          href={`/dashboard/medical?transferId=${transfer.id}&recordFinding=active`}
                          className="text-[10px] font-semibold text-primary hover:underline"
                        >
                          Open in Medical
                        </Link>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                            EXAM_STATUS_BADGE[transfer.medicalExam.status]?.style ||
                            EXAM_STATUS_BADGE.SCHEDULED.style
                          }`}
                        >
                          {EXAM_STATUS_BADGE[transfer.medicalExam.status]?.label ||
                            transfer.medicalExam.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-card p-2.5 rounded-xl border border-border">
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Exam Date</span>
                          <span className="font-medium text-foreground">{transfer.medicalExam.examDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Clinician</span>
                          <span className="font-medium text-foreground">{transfer.medicalExam.clinician}</span>
                        </div>
                      </div>

                      {/* Findings List */}
                      {transfer.medicalExam.findings.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider block">
                            Clinical Findings ({transfer.medicalExam.findings.length})
                          </span>

                          <div className="space-y-2">
                            {transfer.medicalExam.findings.map((finding) => (
                              <div
                                key={finding.id}
                                className="rounded-xl border border-border bg-card p-3 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-foreground">
                                    {finding.condition}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    {formatSeverity(finding.severity)}
                                    {finding.disqualifying && (
                                      <span className="inline-flex items-center rounded-md bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 text-[10px] font-bold text-rose-500">
                                        Disqualifying
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                  {finding.note}
                                </p>

                                {/* Action: Counter based on this finding (if non-disqualifying & negotiation active) */}
                                {!finding.disqualifying && !isTerminal && (
                                  <div className="pt-1">
                                    <button
                                      type="button"
                                      onClick={() => handleStartFindingCounter(finding)}
                                      className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                                    >
                                      <CornerDownRight className="h-3 w-3" />
                                      Counter based on this finding
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Add new finding button */}
                      {canPassMedical && (
                        <div className="pt-2 border-t border-border/40 border-border">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              router.push(`/dashboard/medical?transferId=${transfer.id}&recordFinding=active`);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            Add New Finding
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Inline Counter Offer Form */}
            {showCounterForm && !isTerminal && (
              <form
                onSubmit={handleSubmitCounter}
                className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3 animate-in fade-in duration-200 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground flex items-center gap-1.5">
                    <CornerDownRight className="h-4 w-4 text-primary" />
                    Submit Counter Offer
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCounterForm(false);
                      setCitedFinding(null);
                    }}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Pre-tagged Finding Chip */}
                {citedFinding && (
                  <div className="flex items-center gap-2 rounded-xl bg-purple-500/10 border border-purple-500/30 p-2 text-xs text-purple-700 dark:text-purple-300">
                    <Activity className="h-4 w-4 shrink-0 text-purple-500" />
                    <span>
                      Counter citing finding: <strong>{citedFinding.condition}</strong>
                    </span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Counter Fee Amount ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    required
                    value={counterFee}
                    onChange={(e) => setCounterFee(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Updated Key Terms
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $135,000 + 5% sell-on + treatment clause"
                    value={counterTerms}
                    onChange={(e) => setCounterTerms(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">
                    Negotiation Comment / Rationale
                  </label>
                  <textarea
                    rows={3}
                    placeholder='e.g. We will accept $135k, with a reduced sell-on clause to 5% and a performance add-on of $50k'
                    value={counterNotes}
                    onChange={(e) => setCounterNotes(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCounterForm(false);
                      setCitedFinding(null);
                    }}
                    className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !counterFee}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs cursor-pointer transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send Counter Offer
                  </button>
                </div>
              </form>
            )}

            {/* Action Buttons for active stages */}
            {!isTerminal && !showCounterForm && (
              <div className="space-y-3 pt-2">
                {/* Main Action based on stage */}
                <div className="grid grid-cols-2 gap-2">
                  {onCounterOffer && (
                    <button
                      type="button"
                      onClick={() => {
                        setCitedFinding(null);
                        setShowCounterForm(true);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors cursor-pointer"
                    >
                      <CornerDownRight className="h-4 w-4 text-amber-500" />
                      Counter Offer
                    </button>
                  )}

                  {/* Accept offer / Pass medical based on status */}
                  {transfer.status === "TERMS_AGREED" && onScheduleMedical ? (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => onScheduleMedical(transfer.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-sky-700 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      <Stethoscope className="h-4 w-4" />
                      {isSubmitting ? "Scheduling..." : "Schedule Medical"}
                    </button>
                  ) : canPassMedical && onPassMedical ? (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => onPassMedical(transfer.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {isSubmitting ? "Processing..." : "Pass Medical & Accept"}
                    </button>
                  ) : (
                    onAccept && (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => onAccept(transfer.id)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {isSubmitting ? "Agreeing..." : "Agree Terms"}
                      </button>
                    )
                  )}
                </div>

                {/* Reject & Withdraw Actions (Available at every active stage) */}
                <div className="grid grid-cols-2 gap-2">
                  {onReject && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => onReject(transfer.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  )}

                  {onWithdraw && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => onWithdraw(transfer.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      Withdraw Bid
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Scouting Report Summary Card Footer */}
            {transfer.scoutingReport && (
              <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-primary" />
                    Originating Scouting Report
                  </h4>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                    Rating {transfer.scoutingReport.overallRating}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="text-muted-foreground">Scouting Estimated Value</span>
                  <span className="font-bold text-foreground">
                    {formatCurrency(transfer.scoutingReport.estimatedValue)}
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  "{transfer.scoutingReport.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Close
            </button>

            <Link
              href={`/dashboard/transfers/${transfer.id}`}
              replace
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              <span>View Full Negotiation Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

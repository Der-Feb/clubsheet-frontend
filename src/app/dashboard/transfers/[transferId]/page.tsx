"use client";

import { use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ScrollArea } from "@/components/ScrollArea";
import {
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  CornerDownRight,
  MessageSquare,
  Send,
  FileSignature,
  Target,
  Building2,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Activity,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";
import {
  useTransferDetail,
  useCounterTransferOffer,
  useCounterBasedOnFinding,
  useAcceptTransferOffer,
  useScheduleMedicalExam,
  usePassMedicalExam,
  useRejectTransferOffer,
  useWithdrawTransferOffer,
} from "@/hooks/use-transfers.hook";
import type {
  TransferStatus,
  MedicalExamStatus,
  FindingSeverity,
  MedicalFinding,
} from "@/types/transfers.types";
import { ScheduleMedicalModal } from "@/features/transfers/components/schedule-medical.modal";

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

export default function TransferDetailPage({
  params,
}: {
  params: Promise<{ transferId: string }>;
}) {
  const resolvedParams = use(params);
  const transferId = resolvedParams.transferId;
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: transfer, isLoading } = useTransferDetail(transferId);
  const counterMutation = useCounterTransferOffer();
  const counterFindingMutation = useCounterBasedOnFinding();
  const acceptMutation = useAcceptTransferOffer();
  const scheduleMedicalMutation = useScheduleMedicalExam();
  const passMedicalMutation = usePassMedicalExam();
  const rejectMutation = useRejectTransferOffer();
  const withdrawMutation = useWithdrawTransferOffer();

  // Inline counter form state
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterFee, setCounterFee] = useState<number>(0);
  const [counterTerms, setCounterTerms] = useState("");
  const [counterNotes, setCounterNotes] = useState("");
  const [citedFinding, setCitedFinding] = useState<{ id: string; condition: string } | null>(null);

  // Collapsible thread item states
  const [expandedOfferIds, setExpandedOfferIds] = useState<Record<string, boolean>>({});
  const isScheduleMedicalOpen = searchParams.get("scheduleMedical") === "active";

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
        Loading transfer negotiation details...
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-4">
        <Link
          href="/dashboard/transfers"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Transfers
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Transfer negotiation record not found.
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleOfferExpand = (id: string) => {
    setExpandedOfferIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterFee) return;

    if (citedFinding) {
      counterFindingMutation.mutate({
        transferId: transfer.id,
        findingId: citedFinding.id,
        findingCondition: citedFinding.condition,
        feeAmount: Number(counterFee),
        terms: counterTerms.trim() || undefined,
        notes: counterNotes.trim() || undefined,
      });
    } else {
      counterMutation.mutate({
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
    setCounterFee(Math.round(transfer.currentOfferFee * 0.9));
    setCounterTerms(`Adjusted terms citing ${finding.condition}`);
    setCounterNotes(`Offer adjusted citing clinical finding: ${finding.condition}`);
    setShowCounterForm(true);
  };

  const handleStartCounter = () => {
    setCitedFinding(null);
    setCounterFee(transfer.currentOfferFee);
    setCounterTerms("");
    setCounterNotes("");
    setShowCounterForm(true);
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

  const disqualifyingFinding = transfer.medicalExam?.findings.find((f) => f.disqualifying);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/transfers"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Transfers List
        </Link>

        <span className="text-xs font-mono text-muted-foreground">
          Ref: {transfer.id}
        </span>
      </div>

      {/* Main Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-lg font-bold text-primary">
            {transfer.athleteName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                {transfer.athleteName}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                  STATUS_BADGE[transfer.status]?.style || STATUS_BADGE.OPEN.style
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    STATUS_BADGE[transfer.status]?.dot || STATUS_BADGE.OPEN.dot
                  }`}
                />
                {STATUS_BADGE[transfer.status]?.label || transfer.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{transfer.fromClubName}</span>
              <span>&rarr;</span>
              <span>{transfer.toClubName}</span>
            </p>
          </div>
        </div>

        {/* Current Fee Badge */}
        <div className="rounded-xl border border-border bg-muted/20 p-3 text-right">
          <span className="text-[11px] text-muted-foreground block">Current Offer Fee</span>
          <span className="text-xl font-bold text-foreground">
            {formatCurrency(transfer.currentOfferFee)}
          </span>
        </div>
      </div>

      {/* Resolution Banner: ACCEPTED */}
      {transfer.status === "ACCEPTED" && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-700 dark:text-emerald-400 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <span>Medical cleared — transfer accepted, signing created</span>
          </div>
          <p className="text-xs leading-relaxed text-emerald-700/90 dark:text-emerald-300">
            Medical screening passed cleanly. This transfer negotiation has been officially accepted and a Signing record was created.
          </p>
          {transfer.signingId && (
            <div className="pt-1">
              <Link
                href={`/dashboard/signings/${transfer.signingId}`}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
              >
                <FileSignature className="h-4 w-4" />
                <span>View Resulting Signing Record</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Resolution Banner: DISQUALIFIED */}
      {transfer.status === "DISQUALIFIED" && (
        <div className="rounded-2xl border border-border bg-muted/40 p-5 text-foreground space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-sm text-muted-foreground">
            <ShieldAlert className="h-5 w-5 shrink-0 text-muted-foreground" />
            <span>Transfer ended — disqualifying medical finding</span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Clinical examination revealed a disqualifying finding:{" "}
            <strong className="text-foreground">
              {disqualifyingFinding?.condition || "Severe Clinical Condition"}
            </strong>
            . The transfer process is ended and the athlete's scouting record has been updated to Dropped.
          </p>
        </div>
      )}

      {/* In-Progress Banner: TERMS_AGREED / MEDICAL_SCHEDULED */}
      {(transfer.status === "TERMS_AGREED" || transfer.status === "MEDICAL_SCHEDULED") && (
        <div className="rounded-2xl border border-teal-500/30 bg-teal-500/10 p-5 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-teal-700 dark:text-teal-400">
            <Stethoscope className="h-5 w-5 shrink-0 text-teal-500" />
            <span>Terms Agreed — Medical Screening Stage</span>
          </div>
          <p className="text-xs text-teal-700/80 dark:text-teal-300/80 leading-relaxed">
            Financial agreement reached between clubs. The player is undergoing scheduled medical screening before contract confirmation.
          </p>
        </div>
      )}

      {/* Main Grid: Negotiation Thread & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Negotiation Thread */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Negotiation Thread History ({transfer.negotiationHistory.length})
          </h2>

          {/* Scrollable Thread History Container */}
          <ScrollArea className="max-h-120 space-y-4 relative pr-1 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border pt-2">
            {transfer.negotiationHistory.map((offer, idx) => {
              const isExpanded =
                expandedOfferIds[offer.id] ??
                idx === transfer.negotiationHistory.length - 1;

              return (
                <div key={offer.id} className="relative pl-9">
                  {/* Timeline Dot */}
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
                    className={`rounded-2xl border text-xs shadow-xs transition-all overflow-hidden ${
                      offer.isCounter
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-border bg-card"
                    }`}
                  >
                    {/* Collapsible Header */}
                    <div
                      onClick={() => toggleOfferExpand(offer.id)}
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-foreground text-sm">
                          {offer.clubName}
                        </span>
                        {offer.isCounter ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <CornerDownRight className="h-3 w-3" />
                            Counter Offer
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                            Original Offer
                          </span>
                        )}

                        {/* Cites Finding Chip */}
                        {offer.citesFindingCondition && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            <Activity className="h-3.5 w-3.5" />
                            Cites: {offer.citesFindingCondition}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-foreground">
                          {formatCurrency(offer.feeAmount)}
                        </span>
                        <span className="text-muted-foreground p-1 rounded hover:bg-muted">
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <div className="p-4 pt-0 border-t border-border/40 space-y-3 animate-in fade-in duration-150">
                        <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                          <span>Timestamp:</span>
                          <span>{offer.createdAt}</span>
                        </div>

                        {offer.terms && (
                          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
                            <span className="font-semibold text-muted-foreground block text-[10px] uppercase">
                              Key Terms
                            </span>
                            <span className="text-foreground">{offer.terms}</span>
                          </div>
                        )}

                        {offer.notes && (
                          <div className="rounded-xl border border-border bg-card p-3 text-xs text-foreground space-y-1">
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

            {/* Medical Review Neutral Timeline Card */}
            {transfer.medicalExam && (
              <div className="relative pl-9 pt-1">
                <div className="absolute left-4 top-5 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-card bg-teal-500 shadow-xs" />

                <div className="rounded-2xl border-2 border-border bg-muted/20 p-5 space-y-4 text-xs shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <h4 className="font-bold text-foreground text-sm">
                        Medical Examination Event
                      </h4>
                    </div>
                    <Link
                      href={`/dashboard/medical?transferId=${transfer.id}&recordFinding=active`}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      Open in Medical
                    </Link>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        EXAM_STATUS_BADGE[transfer.medicalExam.status]?.style ||
                        EXAM_STATUS_BADGE.SCHEDULED.style
                      }`}
                    >
                      {EXAM_STATUS_BADGE[transfer.medicalExam.status]?.label ||
                        transfer.medicalExam.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-card p-3 rounded-xl border border-border">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Examination Date</span>
                      <span className="font-semibold text-foreground">{transfer.medicalExam.examDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Screening Clinician</span>
                      <span className="font-semibold text-foreground">{transfer.medicalExam.clinician}</span>
                    </div>
                  </div>

                  {/* Findings */}
                  {transfer.medicalExam.findings.length > 0 && (
                    <div className="space-y-3 pt-1">
                      <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block">
                        Clinical Findings ({transfer.medicalExam.findings.length})
                      </span>

                      <div className="space-y-2">
                        {transfer.medicalExam.findings.map((finding) => (
                          <div
                            key={finding.id}
                            className="rounded-xl border border-border bg-card p-4 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground text-sm">
                                {finding.condition}
                              </span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${
                                    SEVERITY_BADGE[finding.severity]?.style ||
                                    SEVERITY_BADGE.MINOR.style
                                  }`}
                                >
                                  {finding.severity}
                                </span>
                                {finding.disqualifying && (
                                  <span className="inline-flex items-center rounded-md bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-xs font-bold text-rose-500">
                                    Disqualifying
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {finding.note}
                            </p>

                            {!finding.disqualifying && !isTerminal && (
                              <div className="pt-2">
                                <button
                                  type="button"
                                  onClick={() => handleStartFindingCounter(finding)}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                                >
                                  <CornerDownRight className="h-3.5 w-3.5" />
                                  Counter based on this finding
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>

          {/* Action Bar / Form */}
          {!isTerminal && (
            <div className="pt-4 border-t border-border space-y-3">
              {showCounterForm ? (
                <form
                  onSubmit={handleSubmitCounter}
                  className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3 text-xs"
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
                      &times;
                    </button>
                  </div>

                  {citedFinding && (
                    <div className="flex items-center gap-2 rounded-xl bg-purple-500/10 border border-purple-500/30 p-2 text-xs text-purple-700 dark:text-purple-300">
                      <Activity className="h-4 w-4 shrink-0 text-purple-500" />
                      <span>
                        Counter citing clinical finding: <strong>{citedFinding.condition}</strong>
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
                      Negotiation Comment / Counter Rationale
                    </label>
                    <textarea
                      rows={3}
                      placeholder='e.g. We will accept $135k, with a reduced sell-on clause to 5% and a performance add-on of $50k'
                      value={counterNotes}
                      onChange={(e) => setCounterNotes(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCounterForm(false);
                        setCitedFinding(null);
                      }}
                      className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!counterFee}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Submit Counter Offer
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleStartCounter}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors cursor-pointer"
                  >
                    <CornerDownRight className="h-4 w-4 text-amber-500" />
                    Counter Offer
                  </button>

                  {transfer.status === "TERMS_AGREED" ? (
                    <button
                      type="button"
                      onClick={() => router.push(`/dashboard/transfers/${transfer.id}?scheduleMedical=active`)}
                      disabled={scheduleMedicalMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-sky-700 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Stethoscope className="h-4 w-4" />
                      {scheduleMedicalMutation.isPending ? "Scheduling..." : "Schedule Medical"}
                    </button>
                  ) : canPassMedical ? (
                    <button
                      type="button"
                      onClick={() => passMedicalMutation.mutate(transfer.id)}
                      disabled={passMedicalMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {passMedicalMutation.isPending ? "Processing..." : "Pass Medical & Accept"}
                    </button>
                  ) : transfer.medicalCompleted || transfer.status !== "MEDICAL_FLAGGED" ? (
                    <button
                      type="button"
                      onClick={() => acceptMutation.mutate(transfer.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {transfer.medicalCompleted ? "Accept Offer" : "Agree Terms"}
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => rejectMutation.mutate(transfer.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Reject Offer
                  </button>

                  <button
                    type="button"
                    onClick={() => withdrawMutation.mutate(transfer.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    Withdraw Bid
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Col: Scouting Report Summary */}
        <div className="space-y-6">
          {transfer.scoutingReport ? (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs text-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-primary" />
                  Originating Scouting Report
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                  Rating {transfer.scoutingReport.overallRating}
                </span>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1">
                <span className="text-muted-foreground text-[11px] block">
                  Estimated Scouting Market Value
                </span>
                <span className="text-lg font-bold text-foreground">
                  {formatCurrency(transfer.scoutingReport.estimatedValue)}
                </span>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-foreground block">
                  Scout Analysis Notes:
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  "{transfer.scoutingReport.notes}"
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Direct Club Inquiry</p>
              <p>This transfer was initiated directly without a linked scouting report.</p>
            </div>
          )}
        </div>
      </div>
      <ScheduleMedicalModal
        isOpen={isScheduleMedicalOpen}
        transfer={transfer}
        onClose={() => router.push(`/dashboard/transfers/${transfer.id}`)}
        onSchedule={(data) => scheduleMedicalMutation.mutate(data, { onSuccess: () => router.push(`/dashboard/transfers/${transfer.id}`) })}
        isLoading={scheduleMedicalMutation.isPending}
      />
    </div>
  );
}

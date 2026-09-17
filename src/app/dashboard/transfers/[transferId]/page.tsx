"use client";

import { use, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import {
  useTransferDetail,
  useCounterTransferOffer,
  useAcceptTransferOffer,
  useRejectTransferOffer,
  useWithdrawTransferOffer,
} from "@/hooks/use-transfers.hook";
import type { TransferStatus } from "@/types/transfers.types";

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
  ACCEPTED: {
    label: "Accepted",
    style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
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

export default function TransferDetailPage({
  params,
}: {
  params: Promise<{ transferId: string }>;
}) {
  const resolvedParams = use(params);
  const transferId = resolvedParams.transferId;

  const { data: transfer, isLoading } = useTransferDetail(transferId);
  const counterMutation = useCounterTransferOffer();
  const acceptMutation = useAcceptTransferOffer();
  const rejectMutation = useRejectTransferOffer();
  const withdrawMutation = useWithdrawTransferOffer();

  // Inline counter form state
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterFee, setCounterFee] = useState<number>(0);
  const [counterTerms, setCounterTerms] = useState("");
  const [counterNotes, setCounterNotes] = useState("");

  // Collapsible thread item states
  const [expandedOfferIds, setExpandedOfferIds] = useState<Record<string, boolean>>({});

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

    counterMutation.mutate({
      transferId: transfer.id,
      feeAmount: Number(counterFee),
      terms: counterTerms.trim() || undefined,
      notes: counterNotes.trim() || undefined,
    });
    setShowCounterForm(false);
  };

  const isNegotiationActive =
    transfer.status === "OPEN" || transfer.status === "COUNTERED";

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

      {/* Accepted Banner */}
      {transfer.status === "ACCEPTED" && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-700 dark:text-emerald-400 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
            <span>Transfer Accepted — Signing Created</span>
          </div>
          <p className="text-xs leading-relaxed text-emerald-700/90 dark:text-amber-300">
            This transfer negotiation has been officially accepted. A linked Signing offer record has been created for {transfer.athleteName}.
          </p>
          <div className="pt-1">
            <Link
              href={`/dashboard/signings${
                transfer.signingId ? `?signingId=${transfer.signingId}` : ""
              }`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
            >
              <FileSignature className="h-4 w-4" />
              <span>View Resulting Signing Record</span>
            </Link>
          </div>
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
          <div className="max-h-120 overflow-y-auto space-y-4 relative pr-1 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border pt-2">
            {transfer.negotiationHistory.map((offer, idx) => {
              // Default latest offer to expanded
              const isExpanded =
                expandedOfferIds[offer.id] ??
                idx === transfer.negotiationHistory.length - 1;

              return (
                <div key={offer.id} className="relative pl-9">
                  {/* Enlarged Dot on timeline - aligned centered with line */}
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
                      <div className="flex items-center gap-2">
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
                            <span className="font-semibold text-muted-foreground block text-[10px] uppercase flex items-center gap-1">
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
          </div>

          {/* Action Bar / Form */}
          {isNegotiationActive && (
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
                      onClick={() => setShowCounterForm(false)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>

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
                      placeholder="e.g. $135,000 + 5% sell-on + $50k performance bonus"
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
                      placeholder='e.g. We will accept $135k, but with a reduced sell-on clause to 5% and a performance add-on of $50k when he scores over 20 goals'
                      value={counterNotes}
                      onChange={(e) => setCounterNotes(e.target.value)}
                      className="w-full rounded-xl border border-border bg-card p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCounterForm(false)}
                      className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
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
                    onClick={() => setShowCounterForm(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors cursor-pointer"
                  >
                    <CornerDownRight className="h-4 w-4 text-amber-500" />
                    Counter Offer
                  </button>

                  <button
                    type="button"
                    onClick={() => acceptMutation.mutate(transfer.id)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Accept Offer
                  </button>

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
    </div>
  );
}

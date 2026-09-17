"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import type { Transfer, TransferStatus } from "@/types/transfers.types";

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
  onAccept?: (transferId: string) => void;
  onReject?: (transferId: string) => void;
  onWithdraw?: (transferId: string) => void;
  isSubmitting?: boolean;
}

export function TransferDetailDrawer({
  isOpen,
  onClose,
  transfer,
  onCounterOffer,
  onAccept,
  onReject,
  onWithdraw,
  isSubmitting = false,
}: TransferDetailDrawerProps) {
  // Inline counter form state
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterFee, setCounterFee] = useState<number>(0);
  const [counterTerms, setCounterTerms] = useState("");
  const [counterNotes, setCounterNotes] = useState("");

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

  const handleSubmitCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCounterOffer || !counterFee) return;

    onCounterOffer({
      transferId: transfer.id,
      feeAmount: Number(counterFee),
      terms: counterTerms.trim() || undefined,
      notes: counterNotes.trim() || undefined,
    });
    setShowCounterForm(false);
  };

  const toggleOfferExpand = (id: string) => {
    setExpandedOfferIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isNegotiationActive =
    transfer.status === "OPEN" || transfer.status === "COUNTERED";

  // In modal/drawer, show 2 latest offers by default unless showAllHistory is true
  const visibleOffers = showAllHistory
    ? transfer.negotiationHistory
    : transfer.negotiationHistory.slice(-2);

  const hiddenCount = transfer.negotiationHistory.length - 2;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl text-card-foreground animate-in slide-in-from-right duration-250 flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-border bg-muted/20 space-y-3">
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
            {/* Accepted Banner */}
            {transfer.status === "ACCEPTED" && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-400 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Transfer Accepted — Signing Created</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-700/90 dark:text-emerald-300">
                  Negotiation concluded successfully. An official Signing offer record has been created for {transfer.athleteName}.
                </p>
                <div className="pt-1">
                  <Link
                    href={`/dashboard/signings${
                      transfer.signingId ? `?signingId=${transfer.signingId}` : ""
                    }`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition-colors cursor-pointer"
                  >
                    <FileSignature className="h-3.5 w-3.5" />
                    <span>View Resulting Signing Record</span>
                  </Link>
                </div>
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
                      {/* Enlarged Dot on timeline - aligned exactly at left-4 so vertical line passes through center */}
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
                          <div className="flex items-center gap-2">
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
            </div>

            {/* Inline Counter Offer Form */}
            {showCounterForm && isNegotiationActive && (
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
                    onClick={() => setShowCounterForm(false)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-4 w-4" />
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
                    className="w-full rounded-xl border border-border bg-card p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCounterForm(false)}
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

            {/* Action Buttons for active negotiation */}
            {isNegotiationActive && !showCounterForm && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  {onCounterOffer && (
                    <button
                      type="button"
                      onClick={() => setShowCounterForm(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors cursor-pointer"
                    >
                      <CornerDownRight className="h-4 w-4 text-amber-500" />
                      Counter Offer
                    </button>
                  )}

                  {onAccept && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => onAccept(transfer.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {isSubmitting ? "Accepting..." : "Accept Offer"}
                    </button>
                  )}
                </div>

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
          <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Close
            </button>

            <Link
              href={`/dashboard/transfers/${transfer.id}`}
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

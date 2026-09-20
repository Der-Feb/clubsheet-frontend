"use client";

import { useState, useEffect } from "react";
import { X, ArrowRightLeft, DollarSign, Building2, User } from "lucide-react";

interface OpenTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTransfer: (data: {
    athleteName: string;
    athletePosition?: string;
    fromClubName: string;
    toClubName: string;
    feeAmount: number;
    terms?: string;
    notes?: string;
  }) => void;
  isLoading?: boolean;
}

export function OpenTransferModal({
  isOpen,
  onClose,
  onCreateTransfer,
  isLoading = false,
}: OpenTransferModalProps) {
  const [athleteName, setAthleteName] = useState("");
  const [athletePosition, setAthletePosition] = useState("Midfielder");
  const [fromClubName, setFromClubName] = useState("Rayon Sports FC");
  const [toClubName, setToClubName] = useState("APR FC");
  const [feeAmount, setFeeAmount] = useState<number>(100000);
  const [terms, setTerms] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteName.trim() || !fromClubName.trim() || !toClubName.trim()) return;

    onCreateTransfer({
      athleteName: athleteName.trim(),
      athletePosition: athletePosition.trim(),
      fromClubName: fromClubName.trim(),
      toClubName: toClubName.trim(),
      feeAmount: Number(feeAmount) || 0,
      terms: terms.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-180 max-h-[85vh] flex flex-col rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-card-foreground">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-primary/10 p-2 text-primary border border-primary/20">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Open Transfer Negotiation
              </h2>
              <p className="text-xs text-muted-foreground">
                Initiate a official transfer bid for an athlete between clubs.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
            {/* Athlete Name & Position */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block font-semibold text-foreground mb-1 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Athlete Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hakim Sahabo"
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Position
                </label>
                <input
                  type="text"
                  placeholder="e.g. Winger"
                  value={athletePosition}
                  onChange={(e) => setAthletePosition(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* From Club & To Club */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-foreground mb-1 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  From Club (Selling) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rayon Sports FC"
                  value={fromClubName}
                  onChange={(e) => setFromClubName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  To Club (Purchasing) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. APR FC"
                  value={toClubName}
                  onChange={(e) => setToClubName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Opening Transfer Fee */}
            <div>
              <label className="block font-semibold text-foreground mb-1 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Opening Transfer Fee ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                required
                value={feeAmount}
                onChange={(e) => setFeeAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Proposed Terms */}
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Proposed Key Terms
              </label>
              <input
                type="text"
                placeholder="e.g. $100k upfront + 15% sell-on clause"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Internal Negotiation Notes
              </label>
              <textarea
                rows={3}
                placeholder="Add any internal rationale or transfer conditions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-border bg-card p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !athleteName.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs disabled:opacity-50 cursor-pointer transition-colors"
            >
              {isLoading ? "Opening..." : "Submit Opening Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  DollarSign,
  FileSignature,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import type { Signing, SigningStatus } from "@/types/signings.types";

interface SigningDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  signing: Signing | null;
  onAcceptInvitation?: (signingId: string) => void;
  onRegister?: (signingId: string) => void;
  isAccepting?: boolean;
  isRegistering?: boolean;
}

export function SigningDetailDrawer({
  isOpen,
  onClose,
  signing,
  onAcceptInvitation,
  onRegister,
  isAccepting = false,
  isRegistering = false,
}: SigningDetailDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !signing) return null;

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "Not set";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const STATUS_BADGE: Record<SigningStatus, { label: string; style: string }> = {
    DRAFT: { label: "Draft", style: "bg-muted text-muted-foreground border-border" },
    AWAITING_ACCEPTANCE: { label: "Awaiting Acceptance", style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" },
    PENDING_REGISTRATION: { label: "Pending Registration", style: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30" },
    REGISTERED: { label: "Registered", style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
    EXPIRED: { label: "Expired", style: "bg-muted text-muted-foreground border-border" },
    TERMINATED: { label: "Terminated", style: "bg-rose-500/10 text-rose-500 border-rose-500/30" },
  };

  // Determine Stepper Active Step
  const getStepStatus = () => {
    switch (signing.status) {
      case "DRAFT":
        return 1;
      case "AWAITING_ACCEPTANCE":
        return 2;
      case "PENDING_REGISTRATION":
        return 3;
      case "REGISTERED":
        return 4;
      default:
        return 2;
    }
  };

  const currentStep = getStepStatus();
  const isWindowClosed = signing.registrationWindowOpen === false || signing.status === "PENDING_REGISTRATION";

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
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-base font-bold text-primary">
                {signing.athleteName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {signing.athleteName}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      STATUS_BADGE[signing.status]?.style || STATUS_BADGE.DRAFT.style
                    }`}
                  >
                    {STATUS_BADGE[signing.status]?.label || signing.status}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Effective {signing.effectiveDate}
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
            {/* Registration Window Closed Warning Banner */}
            {isWindowClosed && signing.status !== "REGISTERED" && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-400 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>Transfer Window Currently Closed</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-300">
                  Registration is currently closed. This signing is confirmed but awaiting the next registration window.
                </p>
              </div>
            )}

            {/* Stepper Timeline */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Signing Progress Timeline
              </h3>

              <div className="grid grid-cols-4 gap-1 pt-2">
                {[
                  { step: 1, label: "Draft" },
                  { step: 2, label: "Invitation Sent" },
                  { step: 3, label: "Accepted" },
                  { step: 4, label: "Registered" },
                ].map((item) => {
                  const isDone = item.step <= currentStep;
                  const isCurrent = item.step === currentStep;

                  return (
                    <div key={item.step} className="flex flex-col items-center text-center">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          isDone
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="h-4 w-4" /> : item.step}
                      </div>
                      <span
                        className={`mt-1.5 text-[10px] ${
                          isCurrent
                            ? "font-bold text-foreground"
                            : isDone
                            ? "font-medium text-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons depending on status */}
            {signing.status === "AWAITING_ACCEPTANCE" && onAcceptInvitation && (
              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    Invitation Pending
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Athlete or staff can trigger acceptance of this contract.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isAccepting}
                  onClick={() => onAcceptInvitation(signing.id)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <UserCheck className="h-4 w-4" />
                  {isAccepting ? "Accepting..." : "Accept Invitation"}
                </button>
              </div>
            )}

            {signing.status === "PENDING_REGISTRATION" && onRegister && (
              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    Ready for League Registration
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    Register athlete once transfer window is officially active.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isRegistering}
                  onClick={() => onRegister(signing.id)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {isRegistering ? "Registering..." : "Register Athlete"}
                </button>
              </div>
            )}

            {/* Contract Terms */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xs">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileSignature className="h-3.5 w-3.5 text-primary" />
                Contract Financial Terms
              </h3>

              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Contract Length */}
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-muted-foreground block text-[11px]">Contract Duration</span>
                  <span className="font-bold text-foreground text-sm">
                    {signing.contract.lengthMonths} Months
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    ({(signing.contract.lengthMonths / 12).toFixed(1)} Years)
                  </span>
                </div>

                {/* Salary */}
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-muted-foreground block text-[11px]">Salary</span>
                  <span className="font-bold text-foreground text-sm">
                    {formatCurrency(signing.contract.salaryAmount)}
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5 capitalize">
                    {signing.contract.salaryPeriod.toLowerCase()}
                  </span>
                </div>

                {/* Signing Bonus */}
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-muted-foreground block text-[11px]">Signing Bonus</span>
                  <span className="font-bold text-emerald-500 text-sm">
                    {formatCurrency(signing.contract.signingBonus)}
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    Logged as Expense
                  </span>
                </div>

                {/* Performance Add-on */}
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-muted-foreground block text-[11px]">Performance Add-On</span>
                  <span className="font-semibold text-foreground text-sm">
                    {formatCurrency(signing.contract.performanceAddOn)}
                  </span>
                </div>

                {/* Sell-On Clause */}
                <div className="col-span-2 rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-muted-foreground block text-[11px]">Sell-On Clause Percentage</span>
                  <span className="font-semibold text-foreground text-sm">
                    {signing.contract.sellOnClause ? `${signing.contract.sellOnClause}%` : "Not set"}
                  </span>
                </div>

                {/* Custom Additional Fees */}
                {signing.contract.otherFees && signing.contract.otherFees.length > 0 && (
                  <div className="col-span-2 rounded-xl border border-border bg-muted/30 p-3 space-y-2">
                    <span className="text-muted-foreground block text-[11px] font-semibold uppercase tracking-wider">
                      Additional Custom Fees
                    </span>
                    <div className="space-y-1.5">
                      {signing.contract.otherFees.map((fee, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-foreground font-medium">{fee.name}</span>
                          <span className="font-bold text-foreground">
                            {formatCurrency(fee.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Traceability Info */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-xs text-xs">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                System Traceability
              </h3>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Signing Record ID</span>
                <span className="font-mono text-foreground font-medium">{signing.id}</span>
              </div>
              {signing.transferId && (
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="text-muted-foreground">Transfer Ref</span>
                  <span className="font-mono text-primary font-medium">{signing.transferId}</span>
                </div>
              )}
              {signing.scoutingTargetId && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Scouting Target Ref</span>
                  <span className="font-mono text-primary font-medium">{signing.scoutingTargetId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Close
            </button>

            <Link
              href={`/dashboard/signings/${signing.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              <span>View Full Signing Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

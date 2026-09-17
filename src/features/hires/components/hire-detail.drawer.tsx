"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  DollarSign,
  Briefcase,
  ArrowRight,
  UserCheck,
  Ban,
  Send,
  FileText,
} from "lucide-react";
import type { DirectHire, HireStatus } from "@/types/hires.types";
import { useContractDetail } from "@/hooks/use-contracts.hook";
import { useInvitationDetail } from "@/hooks/use-invitations.hook";

interface HireDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hire: DirectHire | null;
  onAcceptInvitation?: (hireId: string) => void;
  onResendInvitation?: (hireId: string) => void;
  onTerminate?: (hireId: string) => void;
  isAccepting?: boolean;
  isTerminating?: boolean;
}

const STATUS_BADGE: Record<HireStatus, { label: string; style: string }> = {
  INVITED: {
    label: "Invited",
    style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  ACTIVE: {
    label: "Active",
    style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  TERMINATED: {
    label: "Terminated",
    style: "bg-rose-500/10 text-rose-500 border-rose-500/30",
  },
};

export function HireDetailDrawer({
  isOpen,
  onClose,
  hire,
  onAcceptInvitation,
  onResendInvitation,
  onTerminate,
  isAccepting = false,
  isTerminating = false,
}: HireDetailDrawerProps) {
  const { data: contract } = useContractDetail(hire?.contractId || "");
  const { data: invitation } = useInvitationDetail(hire?.invitationId || "");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !hire) return null;

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "Not set";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-base font-bold text-primary">
                {hire.personName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {hire.personName}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      STATUS_BADGE[hire.status]?.style || STATUS_BADGE.INVITED.style
                    }`}
                  >
                    {STATUS_BADGE[hire.status]?.label || hire.status}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {hire.role}
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
            {/* Status-specific Action / Banner */}
            {hire.status === "INVITED" && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    Invitation Pending
                  </h4>
                  <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                    Invitation was dispatched. Staff member has not yet accepted.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {onAcceptInvitation && (
                    <button
                      type="button"
                      disabled={isAccepting}
                      onClick={() => onAcceptInvitation(hire.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      {isAccepting ? "Activating..." : "Accept Invitation"}
                    </button>
                  )}

                  {onResendInvitation && (
                    <button
                      type="button"
                      onClick={() => onResendInvitation(hire.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Resend
                    </button>
                  )}
                </div>
              </div>
            )}

            {hire.status === "ACTIVE" && onTerminate && (
              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">
                      Active Contract Status
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Contract active since {hire.startDate}.
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isTerminating}
                  onClick={() => onTerminate(hire.id)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <Ban className="h-3.5 w-3.5" />
                  {isTerminating ? "Terminating..." : "Terminate Contract"}
                </button>
              </div>
            )}

            {/* Contract Summary Card */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                  Contract Summary
                </h3>
                {hire.contractId && (
                  <Link
                    href={`/dashboard/contracts/${hire.contractId}`}
                    replace
                    onClick={onClose}
                    className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View full contract <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {contract ? (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <span className="text-muted-foreground block text-[11px]">Salary</span>
                    <span className="font-bold text-foreground text-sm">
                      {formatCurrency(contract.salaryAmount)}
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5 capitalize">
                      {contract.salaryPeriod.toLowerCase()}
                    </span>
                  </div>

                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <span className="text-muted-foreground block text-[11px]">Duration</span>
                    <span className="font-bold text-foreground text-sm">
                      {contract.lengthMonths} Months
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      ({(contract.lengthMonths / 12).toFixed(1)} Yrs)
                    </span>
                  </div>

                  <div className="col-span-2 rounded-xl border border-border bg-muted/30 p-3 flex justify-between items-center">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Signing Bonus</span>
                      <span className="font-bold text-emerald-500 text-sm">
                        {formatCurrency(contract.signingBonus)}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Start: {contract.startDate || hire.startDate}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-muted-foreground">
                  Loading contract details...
                </div>
              )}
            </div>

            {/* Traceability Info */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-xs text-xs">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                System Traceability
              </h3>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Hire Record ID</span>
                <span className="font-mono text-foreground font-medium">{hire.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Membership ID</span>
                <span className="font-mono text-primary font-medium">{hire.membershipId}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Contract ID</span>
                <span className="font-mono text-primary font-medium">{hire.contractId}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-card shrink-0 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Close
            </button>

            <Link
              href={`/dashboard/hires/${hire.id}`}
              replace
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              <span>View Full Hire Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

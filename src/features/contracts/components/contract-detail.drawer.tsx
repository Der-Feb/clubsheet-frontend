"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  Calendar,
  DollarSign,
  FileSignature,
  ArrowRight,
  Building2,
  FileText,
  UserCheck,
  Ban,
  Briefcase,
} from "lucide-react";
import type { Contract } from "@/types/contracts.types";
import { ScrollArea } from "@/components/ScrollArea";
import { useSignings } from "@/hooks/use-signings.hook";
import { useHires } from "@/hooks/use-hires.hook";
import { useMembers } from "@/hooks/use-members-roles.hook";

interface ContractDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract | null;
  onTerminate?: (contractId: string) => void;
  isTerminating?: boolean;
}

export function ContractDetailDrawer({
  isOpen,
  onClose,
  contract,
  onTerminate,
  isTerminating = false,
}: ContractDetailDrawerProps) {
  const { data: signings = [] } = useSignings();
  const { data: hires = [] } = useHires();
  const { data: members = [] } = useMembers();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !contract) return null;

  // Resolve Person Name & Role
  const linkedSigning = contract.signingId
    ? signings.find((s) => s.id === contract.signingId || s.contractId === contract.id)
    : null;
  const linkedHire = contract.hireId
    ? hires.find((h) => h.id === contract.hireId || h.contractId === contract.id)
    : null;
  const linkedMember = members.find((m) => m.id === contract.membershipId);

  const personName =
    linkedSigning?.athleteName ||
    linkedHire?.personName ||
    linkedMember?.name ||
    "Contract Holder";

  const personRole =
    linkedSigning
      ? "Athlete"
      : linkedHire
      ? linkedHire.role
      : linkedMember?.role || "Staff Member";

  const originType = contract.signingId
    ? "Signing"
    : contract.hireId
    ? "Direct Hire"
    : "Direct Hire";

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

      <div className="fixed inset-y-0 right-0 flex w-full max-w-md pl-4 sm:pl-10">
        {/* Drawer Panel */}
        <div className="w-full bg-card border-l border-border shadow-2xl text-card-foreground animate-in slide-in-from-right duration-250 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-base font-bold text-primary">
                {personName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {personName}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      originType === "Signing"
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                    }`}
                  >
                    {originType}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {personRole}
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
          <ScrollArea className="flex-1 p-6 space-y-6">
            {/* Origin Integration Card */}
            <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    Contract Origin: {originType}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {contract.signingId
                      ? "Originated through athlete signing & transfer workflow."
                      : "Originated as direct hire contract without transfer pipeline."}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground bg-card border border-border px-2 py-1 rounded-md">
                  {contract.id}
                </span>
              </div>

              {contract.signingId && (
                <Link
                  href={`/dashboard/signings/${contract.signingId}`}
                  replace
                  onClick={onClose}
                  className="inline-flex items-center justify-between w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <FileSignature className="h-3.5 w-3.5 text-primary" />
                    View Associated Signing Record
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}

              {contract.hireId && (
                <Link
                  href={`/dashboard/hires/${contract.hireId}`}
                  replace
                  onClick={onClose}
                  className="inline-flex items-center justify-between w-full rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                    View Associated Direct Hire Record
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            {/* Full Contract Financial Terms */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-xs">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                Contract Terms & Compensation
              </h3>

              <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                {/* Duration */}
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-muted-foreground block text-[11px]">Duration</span>
                  <span className="font-bold text-foreground text-sm">
                    {contract.lengthMonths} Months
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    ({(contract.lengthMonths / 12).toFixed(1)} Years)
                  </span>
                </div>

                {/* Salary */}
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-muted-foreground block text-[11px]">Salary</span>
                  <span className="font-bold text-foreground text-sm">
                    {formatCurrency(contract.salaryAmount)}
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5 capitalize">
                    {contract.salaryPeriod.toLowerCase()}
                  </span>
                </div>

                {/* Signing Bonus */}
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-muted-foreground block text-[11px]">Signing Bonus</span>
                  <span className="font-bold text-emerald-500 text-sm">
                    {formatCurrency(contract.signingBonus)}
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    Upfront commitment
                  </span>
                </div>

                {/* Start Date */}
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <span className="text-muted-foreground block text-[11px]">Start Date</span>
                  <span className="font-bold text-foreground text-sm">
                    {contract.startDate || "Immediate"}
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    Commencement
                  </span>
                </div>

                {/* Performance Add-on */}
                {contract.performanceAddOn !== undefined && (
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <span className="text-muted-foreground block text-[11px]">Performance Add-On</span>
                    <span className="font-semibold text-foreground text-sm">
                      {formatCurrency(contract.performanceAddOn)}
                    </span>
                  </div>
                )}

                {/* Sell-On Clause */}
                {contract.sellOnClause !== undefined && (
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <span className="text-muted-foreground block text-[11px]">Sell-On Clause</span>
                    <span className="font-semibold text-foreground text-sm">
                      {contract.sellOnClause}%
                    </span>
                  </div>
                )}

                {/* Custom Additional Fees */}
                {contract.otherFees && contract.otherFees.length > 0 && (
                  <div className="col-span-full rounded-xl border border-border bg-muted/30 p-3 space-y-2">
                    <span className="text-muted-foreground block text-[11px] font-semibold uppercase tracking-wider">
                      Additional Fees & Commissions
                    </span>
                    <div className="space-y-1.5">
                      {contract.otherFees.map((fee, idx) => (
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
                System Identifiers
              </h3>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Contract ID</span>
                <span className="font-mono text-foreground font-medium">{contract.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border">
                <span className="text-muted-foreground">Membership ID</span>
                <span className="font-mono text-primary font-medium">{contract.membershipId}</span>
              </div>
              {contract.signingId && (
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="text-muted-foreground">Signing Ref</span>
                  <span className="font-mono text-primary font-medium">{contract.signingId}</span>
                </div>
              )}
              {contract.hireId && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Hire Ref</span>
                  <span className="font-mono text-primary font-medium">{contract.hireId}</span>
                </div>
              )}
            </div>

            {/* Terminate Action */}
            {onTerminate && (
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isTerminating}
                  onClick={() => onTerminate(contract.id)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <Ban className="h-3.5 w-3.5" />
                  {isTerminating ? "Terminating..." : "Terminate Contract"}
                </button>
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="flex shrink-0 flex-col items-stretch justify-between gap-3 border-t border-border bg-card p-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Close
            </button>

            <Link
              href={`/dashboard/contracts/${contract.id}`}
              replace
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              <span>View Full Contract Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileSignature,
  Briefcase,
  Building2,
  FileText,
  Ban,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  useContractDetail,
  useTerminateContract,
} from "@/hooks/use-contracts.hook";
import { useSignings } from "@/hooks/use-signings.hook";
import { useHires } from "@/hooks/use-hires.hook";
import { useMembers } from "@/hooks/use-members-roles.hook";

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const resolvedParams = use(params);
  const contractId = resolvedParams.contractId;

  const { data: contract, isLoading } = useContractDetail(contractId);
  const { data: signings = [] } = useSignings();
  const { data: hires = [] } = useHires();
  const { data: members = [] } = useMembers();

  const terminateContractMutation = useTerminateContract();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
        Loading contract details...
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-4">
        <Link
          href="/dashboard/contracts"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Contracts
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Contract record not found.
        </div>
      </div>
    );
  }

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

  const personRole = linkedSigning
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
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link
          href="/dashboard/contracts"
          className="hover:text-foreground font-medium flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Contracts
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate max-w-xs">
          {contract.id} ({personName})
        </span>
      </div>

      {/* Main Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-lg font-bold text-primary">
            {personName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                {personName}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                  originType === "Signing"
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                }`}
              >
                {originType === "Signing" ? (
                  <FileSignature className="h-3.5 w-3.5" />
                ) : (
                  <Briefcase className="h-3.5 w-3.5" />
                )}
                {originType}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-3">
              <span>{personRole}</span>
              <span>•</span>
              <span className="font-mono">{contract.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Created: {contract.createdAt}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={terminateContractMutation.isPending}
            onClick={() => terminateContractMutation.mutate(contract.id)}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Ban className="h-4 w-4" />
            {terminateContractMutation.isPending ? "Terminating..." : "Terminate Contract"}
          </button>
        </div>
      </div>

      {/* Contract & Origin Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Financial Terms */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Core Compensation & Contract Terms
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <span className="text-xs text-muted-foreground block">Contract Duration</span>
              <span className="text-lg font-bold text-foreground">
                {contract.lengthMonths} Months
              </span>
              <span className="text-xs text-muted-foreground block mt-1">
                {(contract.lengthMonths / 12).toFixed(1)} Years
              </span>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <span className="text-xs text-muted-foreground block">Base Salary</span>
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(contract.salaryAmount)}
              </span>
              <span className="text-xs text-muted-foreground block mt-1 capitalize">
                Paid {contract.salaryPeriod.toLowerCase()}
              </span>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <span className="text-xs text-muted-foreground block">Signing Bonus</span>
              <span className="text-lg font-bold text-emerald-500">
                {formatCurrency(contract.signingBonus)}
              </span>
              <span className="text-xs text-muted-foreground block mt-1">
                Committed upfront expense
              </span>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <span className="text-xs text-muted-foreground block">Start Date</span>
              <span className="text-lg font-semibold text-foreground">
                {contract.startDate || "Immediate"}
              </span>
              <span className="text-xs text-muted-foreground block mt-1">
                Commencement date
              </span>
            </div>

            {contract.performanceAddOn !== undefined && (
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="text-xs text-muted-foreground block">Performance Add-On</span>
                <span className="text-lg font-semibold text-foreground">
                  {formatCurrency(contract.performanceAddOn)}
                </span>
              </div>
            )}

            {contract.sellOnClause !== undefined && (
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <span className="text-xs text-muted-foreground block">Sell-On Clause</span>
                <span className="text-base font-bold text-foreground">
                  {contract.sellOnClause}%
                </span>
                <span className="text-xs text-muted-foreground block mt-1">
                  Future transfer fee share
                </span>
              </div>
            )}
          </div>

          {contract.otherFees && contract.otherFees.length > 0 && (
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
              <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">
                Additional Fees & Commissions
              </span>
              <div className="divide-y divide-border">
                {contract.otherFees.map((fee, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 text-xs">
                    <span className="text-foreground font-semibold">{fee.name}</span>
                    <span className="font-bold text-foreground">{formatCurrency(fee.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Origin & Traceability */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Origin & References
          </h2>

          <div className="space-y-3 text-xs">
            {/* Origin Card */}
            <div className="rounded-xl border border-border p-3 space-y-2">
              <span className="text-muted-foreground text-[11px] block">
                Origin Pipeline
              </span>
              <p className="font-semibold text-foreground">
                {originType === "Signing"
                  ? "Athlete Transfer & Signing Pipeline"
                  : "Direct Staff & Coach Hiring Flow"}
              </p>

              {contract.signingId && (
                <Link
                  href={`/dashboard/signings/${contract.signingId}`}
                  className="inline-flex items-center justify-between w-full rounded-lg border border-border bg-card p-2 text-xs font-semibold text-primary hover:bg-muted transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <FileSignature className="h-3.5 w-3.5" />
                    Open Signing Record
                  </span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}

              {contract.hireId && (
                <Link
                  href={`/dashboard/hires/${contract.hireId}`}
                  className="inline-flex items-center justify-between w-full rounded-lg border border-border bg-card p-2 text-xs font-semibold text-primary hover:bg-muted transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    Open Direct Hire Record
                  </span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>

            <div className="rounded-xl border border-border p-3 space-y-1">
              <span className="text-muted-foreground text-[11px]">
                Membership ID
              </span>
              <p className="font-mono font-semibold text-primary">
                {contract.membershipId}
              </p>
            </div>

            <div className="rounded-xl border border-border p-3 space-y-1">
              <span className="text-muted-foreground text-[11px]">
                Contract Record Reference
              </span>
              <p className="font-mono font-semibold text-primary">
                {contract.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

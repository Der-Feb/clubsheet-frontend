"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileSignature,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  ShieldCheck,
  Building2,
  Target,
  ArrowRightLeft,
  Banknote,
} from "lucide-react";
import {
  useSigningDetail,
  useAcceptSigningInvitation,
  useRegisterSigning,
} from "@/hooks/use-signings.hook";
import { useContractDetail } from "@/hooks/use-contracts.hook";
import type { SigningStatus } from "@/types/signings.types";

const STATUS_BADGE: Record<SigningStatus, { label: string; style: string; dot: string }> = {
  DRAFT: {
    label: "Draft",
    style: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  AWAITING_ACCEPTANCE: {
    label: "Awaiting Acceptance",
    style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
  },
  PENDING_REGISTRATION: {
    label: "Pending Registration",
    style: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    dot: "bg-purple-500",
  },
  REGISTERED: {
    label: "Registered",
    style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  EXPIRED: {
    label: "Expired",
    style: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  TERMINATED: {
    label: "Terminated",
    style: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    dot: "bg-rose-500",
  },
};

export default function SigningDetailPage({
  params,
}: {
  params: Promise<{ signingId: string }>;
}) {
  const resolvedParams = use(params);
  const signingId = resolvedParams.signingId;

  const { data: signing, isLoading } = useSigningDetail(signingId);
  const { data: contract } = useContractDetail(signing?.contractId || "");
  const acceptInvitationMutation = useAcceptSigningInvitation();
  const registerSigningMutation = useRegisterSigning();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
        Loading signing contract details...
      </div>
    );
  }

  if (!signing) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-4">
        <Link
          href="/dashboard/signings"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Signings
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Signing record not found.
        </div>
      </div>
    );
  }

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "Not set";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/signings"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Signings List
        </Link>

        <span className="text-xs font-mono text-muted-foreground">
          Ref: {signing.id}
        </span>
      </div>

      {/* Main Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-lg font-bold text-primary">
            {signing.athleteName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                {signing.athleteName}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                  STATUS_BADGE[signing.status]?.style || STATUS_BADGE.DRAFT.style
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    STATUS_BADGE[signing.status]?.dot || STATUS_BADGE.DRAFT.dot
                  }`}
                />
                {STATUS_BADGE[signing.status]?.label || signing.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Effective Contract Date: <span className="font-semibold text-foreground">{signing.effectiveDate}</span>
            </p>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center gap-2">
          {signing.status === "AWAITING_ACCEPTANCE" && (
            <button
              type="button"
              disabled={acceptInvitationMutation.isPending}
              onClick={() => acceptInvitationMutation.mutate(signing.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
            >
              <UserCheck className="h-4 w-4" />
              {acceptInvitationMutation.isPending ? "Accepting..." : "Accept Invitation"}
            </button>
          )}

          {signing.status === "PENDING_REGISTRATION" && (
            <button
              type="button"
              disabled={registerSigningMutation.isPending}
              onClick={() => registerSigningMutation.mutate(signing.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              {registerSigningMutation.isPending ? "Registering..." : "Register Athlete"}
            </button>
          )}
        </div>
      </div>

      {/* Closed Transfer Window Warning Banner */}
      {isWindowClosed && signing.status !== "REGISTERED" && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-700 dark:text-amber-400 space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
            <span>Registration Window Closed</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-700/90 dark:text-amber-300">
            Registration is currently closed. This signing is confirmed but awaiting the next registration window.
          </p>
        </div>
      )}

      {/* Signing Progress Stepper */}
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Signing Workflow Stepper
        </h2>

        <div className="grid grid-cols-4 gap-2 pt-2">
          {[
            { step: 1, label: "Draft Offer", desc: "Contract created" },
            { step: 2, label: "Invitation Sent", desc: "Awaiting response" },
            { step: 3, label: "Invitation Accepted", desc: "Contract confirmed" },
            { step: 4, label: "Registered", desc: "Official league registration" },
          ].map((item) => {
            const isDone = item.step <= currentStep;
            const isCurrent = item.step === currentStep;

            return (
              <div
                key={item.step}
                className={`rounded-xl p-3 border text-center transition-colors ${
                  isCurrent
                    ? "border-primary bg-primary/5"
                    : isDone
                    ? "border-border bg-card"
                    : "border-border/60 bg-muted/20 opacity-60"
                }`}
              >
                <div
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    isDone
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : item.step}
                </div>
                <p className="mt-2 text-xs font-bold text-foreground">
                  {item.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contract Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Financial Terms */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <FileSignature className="h-4 w-4 text-primary" />
            Core Financial Terms
          </h2>

          {contract ? (
            <>
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
                  <span className="text-xs text-muted-foreground block">Performance Add-On</span>
                  <span className="text-lg font-semibold text-foreground">
                    {formatCurrency(contract.performanceAddOn)}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">Sell-On Clause</span>
                  <span className="text-base font-bold text-foreground">
                    {contract.sellOnClause ? `${contract.sellOnClause}%` : "Not set"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground max-w-xs text-right">
                  Percentage share granted to former club on future transfer.
                </span>
              </div>

              {contract.otherFees && contract.otherFees.length > 0 && (
                <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                  <span className="text-xs text-muted-foreground font-semibold block uppercase tracking-wider">
                    Additional Custom Fees & Commissions
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
            </>
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Loading contract financial terms...
            </div>
          )}
        </div>

        {/* Linked Traceability & Accounting */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Integrations & Traceability
          </h2>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-border p-3 space-y-1">
              <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                <Banknote className="h-3.5 w-3.5 text-emerald-500" />
                Finance Expense Logged
              </span>
              <p className="font-semibold text-foreground">
                {contract ? formatCurrency(contract.signingBonus) : "—"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Recorded in Club Finance as Signing Bonus expense.
              </p>
            </div>

            {signing.transferId && (
              <div className="rounded-xl border border-border p-3 space-y-1">
                <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
                  Originating Transfer
                </span>
                <p className="font-mono font-semibold text-primary">
                  {signing.transferId}
                </p>
              </div>
            )}

            {signing.scoutingTargetId && (
              <div className="rounded-xl border border-border p-3 space-y-1">
                <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                  <Target className="h-3.5 w-3.5 text-primary" />
                  Scouting Target
                </span>
                <p className="font-mono font-semibold text-primary">
                  {signing.scoutingTargetId}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

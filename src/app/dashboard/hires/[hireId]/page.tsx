"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Briefcase,
  UserCheck,
  Ban,
  Send,
  Building2,
  FileText,
  Mail,
  ArrowRight,
} from "lucide-react";
import {
  useHireDetail,
  useAcceptHireInvitation,
  useResendHireInvitation,
  useTerminateHire,
} from "@/hooks/use-hires.hook";
import { useContractDetail } from "@/hooks/use-contracts.hook";
import { useInvitationDetail } from "@/hooks/use-invitations.hook";
import type { HireStatus } from "@/types/hires.types";

const STATUS_BADGE: Record<HireStatus, { label: string; style: string; dot: string }> = {
  INVITED: {
    label: "Invited",
    style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
  },
  ACTIVE: {
    label: "Active",
    style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  TERMINATED: {
    label: "Terminated",
    style: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    dot: "bg-rose-500",
  },
};

export default function HireDetailPage({
  params,
}: {
  params: Promise<{ hireId: string }>;
}) {
  const resolvedParams = use(params);
  const hireId = resolvedParams.hireId;

  const { data: hire, isLoading } = useHireDetail(hireId);
  const { data: contract } = useContractDetail(hire?.contractId || "");
  const { data: invitation } = useInvitationDetail(hire?.invitationId || "");

  const acceptInvitationMutation = useAcceptHireInvitation();
  const resendInvitationMutation = useResendHireInvitation();
  const terminateHireMutation = useTerminateHire();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
        Loading staff contract details...
      </div>
    );
  }

  if (!hire) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-4">
        <Link
          href="/dashboard/hires"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Staff & Coaches
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Direct hire record not found.
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

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link
          href="/dashboard/hires"
          className="hover:text-foreground font-medium flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Staff & Coaches
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate max-w-xs">
          {hire.personName}
        </span>
      </div>

      {/* Main Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-lg font-bold text-primary">
            {hire.personName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                {hire.personName}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                  STATUS_BADGE[hire.status]?.style || STATUS_BADGE.INVITED.style
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    STATUS_BADGE[hire.status]?.dot || STATUS_BADGE.INVITED.dot
                  }`}
                />
                {STATUS_BADGE[hire.status]?.label || hire.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                {hire.role}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Start: {hire.startDate}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hire.status === "INVITED" && (
            <>
              <button
                type="button"
                disabled={acceptInvitationMutation.isPending}
                onClick={() => acceptInvitationMutation.mutate(hire.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
              >
                <UserCheck className="h-4 w-4" />
                {acceptInvitationMutation.isPending ? "Activating..." : "Accept Invitation"}
              </button>
              <button
                type="button"
                disabled={resendInvitationMutation.isPending}
                onClick={() => resendInvitationMutation.mutate(hire.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                <Send className="h-4 w-4" />
                Resend
              </button>
            </>
          )}

          {hire.status === "ACTIVE" && (
            <button
              type="button"
              disabled={terminateHireMutation.isPending}
              onClick={() => terminateHireMutation.mutate(hire.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <Ban className="h-4 w-4" />
              {terminateHireMutation.isPending ? "Terminating..." : "Terminate Contract"}
            </button>
          )}
        </div>
      </div>

      {/* Contract & Staff Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Compensation Terms */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Contract Financial Terms
            </h2>
            {hire.contractId && (
              <Link
                href={`/dashboard/contracts/${hire.contractId}`}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                View full contract record <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>

          {contract ? (
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
                  {contract.startDate || hire.startDate}
                </span>
                <span className="text-xs text-muted-foreground block mt-1">
                  Effective commencement
                </span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Loading contract details...
            </div>
          )}
        </div>

        {/* Member & System Traceability */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Direct Hire Traceability
          </h2>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-border p-3 space-y-1">
              <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-primary" />
                Contact Email
              </span>
              <p className="font-semibold text-foreground">
                {hire.personEmail || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl border border-border p-3 space-y-1">
              <span className="text-muted-foreground text-[11px]">
                Membership ID
              </span>
              <p className="font-mono font-semibold text-primary">
                {hire.membershipId}
              </p>
            </div>

            <div className="rounded-xl border border-border p-3 space-y-1">
              <span className="text-muted-foreground text-[11px]">
                Contract Record Reference
              </span>
              <p className="font-mono font-semibold text-primary">
                {hire.contractId}
              </p>
            </div>

            {invitation && (
              <div className="rounded-xl border border-border p-3 space-y-1">
                <span className="text-muted-foreground text-[11px]">
                  Invitation Status
                </span>
                <p className="font-semibold text-foreground">
                  {invitation.status} (Expires: {new Date(invitation.expiresAt).toLocaleDateString()})
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

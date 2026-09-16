"use client";

import { useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Banknote,
  Calendar,
  Tag,
  User,
  FileText,
  Clock,
  Hash,
  ExternalLink,
  Trash2,
} from "lucide-react";
import {
  useFinancialRecord,
  useDeleteFinancialRecord,
} from "@/hooks/use-finance.hook";
import { ConfirmDialog } from "@/features/members-roles/components/confirm-dialog";
import { useRouter } from "next/navigation";

const CATEGORY_LABELS: Record<string, string> = {
  TRANSFER_FEE: "Transfer Fee",
  SALARY: "Salary",
  SPONSORSHIP: "Sponsorship",
  TICKET_SALES: "Ticket Sales",
  MERCHANDISE: "Merchandise",
  FACILITY: "Facility Costs",
  OTHER: "Other",
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  SPONSORSHIP:   { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30", dot: "bg-emerald-500" },
  TICKET_SALES:  { bg: "bg-blue-500/10",    text: "text-blue-600 dark:text-blue-400",    border: "border-blue-500/30",    dot: "bg-blue-500" },
  MERCHANDISE:   { bg: "bg-purple-500/10",  text: "text-purple-600 dark:text-purple-400",  border: "border-purple-500/30",  dot: "bg-purple-500" },
  TRANSFER_FEE:  { bg: "bg-amber-500/10",   text: "text-amber-600 dark:text-amber-400",   border: "border-amber-500/30",   dot: "bg-amber-500" },
  SALARY:        { bg: "bg-rose-500/10",    text: "text-rose-600 dark:text-rose-400",    border: "border-rose-500/30",    dot: "bg-rose-500" },
  FACILITY:      { bg: "bg-indigo-500/10",  text: "text-indigo-600 dark:text-indigo-400",  border: "border-indigo-500/30",  dot: "bg-indigo-500" },
  OTHER:         { bg: "bg-muted/60",       text: "text-muted-foreground",               border: "border-border",          dot: "bg-muted-foreground" },
};

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function FinanceRecordDetailContent() {
  const params = useParams();
  const recordId = params.recordId as string;
  const router = useRouter();

  const { data: record, isLoading } = useFinancialRecord(recordId);
  const deleteMutation = useDeleteFinancialRecord();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "metadata">("overview");

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-xs text-muted-foreground">
        Loading financial record...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-6 md:p-8 space-y-4 max-w-5xl mx-auto">
        <Link
          href="/dashboard/finance"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Finance
        </Link>
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-base font-semibold text-foreground">Record Not Found</p>
          <p className="mt-1 text-xs text-muted-foreground">
            This financial record does not exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  const isIncome = record.type === "INCOME";
  const categoryColor = CATEGORY_COLORS[record.category] ?? CATEGORY_COLORS.OTHER;
  const categoryLabel = CATEGORY_LABELS[record.category] ?? record.category;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard/finance"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Finance
      </Link>

      {/* Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: icon + description + badges */}
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
                isIncome
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-500"
              }`}
            >
              {isIncome ? (
                <TrendingUp className="h-7 w-7" />
              ) : (
                <TrendingDown className="h-7 w-7" />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                  {record.description}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Type badge */}
                {isIncome ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Income
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Expense
                  </span>
                )}

                {/* Category badge */}
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${categoryColor.dot}`} />
                  {categoryLabel}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-0.5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(record.recordDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Banknote className="h-3.5 w-3.5" />
                  {record.currency}
                </span>
                {record.linkedEntityName && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" />
                    <span className="text-foreground font-medium">{record.linkedEntityName}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: amount + actions */}
          <div className="flex flex-col items-start lg:items-end gap-3">
            <div className="text-right">
              <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-0.5">
                Amount
              </p>
              <p
                className={`text-3xl font-black ${
                  isIncome ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {isIncome ? "+" : "−"}
                {formatCurrency(record.amount, record.currency)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Record
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center border-b border-border">
        {(["overview", "metadata"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "overview" ? (
              <>
                <FileText className="h-4 w-4" />
                Overview
              </>
            ) : (
              <>
                <Hash className="h-4 w-4" />
                Metadata & IDs
              </>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Amount Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-1.5">
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
              <Banknote className="h-3.5 w-3.5" />
              Amount
            </p>
            <p className={`text-2xl font-black ${isIncome ? "text-emerald-500" : "text-rose-500"}`}>
              {formatCurrency(record.amount, record.currency)}
            </p>
            <p className="text-[11px] text-muted-foreground">{record.currency} · {isIncome ? "Revenue" : "Expenditure"}</p>
          </div>

          {/* Date Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-1.5">
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Record Date
            </p>
            <p className="text-lg font-bold text-foreground">{formatDate(record.recordDate)}</p>
            <p className="text-[11px] text-muted-foreground">Transaction date</p>
          </div>

          {/* Category Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-1.5">
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Category
            </p>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold border ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}`}
            >
              <span className={`h-2 w-2 rounded-full ${categoryColor.dot}`} />
              {categoryLabel}
            </span>
            <p className="text-[11px] text-muted-foreground">Financial classification</p>
          </div>

          {/* Linked Entity Card (full-width if present) */}
          {record.linkedEntityName && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-1.5 sm:col-span-2 lg:col-span-3">
              <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Linked Member / Entity
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm border border-primary/20">
                  {record.linkedEntityName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{record.linkedEntityName}</p>
                  <p className="text-[11px] text-muted-foreground">Associated member or entity</p>
                </div>
                <Link
                  href="/dashboard/members"
                  className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Members
                </Link>
              </div>
            </div>
          )}

          {/* Related Transfer / Membership links */}
          {(record.relatedTransferId || record.relatedMembershipId) && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 sm:col-span-2 lg:col-span-3">
              <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                Related Records
              </p>
              <div className="flex flex-wrap gap-2">
                {record.relatedTransferId && (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Transfer ID: {record.relatedTransferId}
                  </span>
                )}
                {record.relatedMembershipId && (
                  <Link
                    href={`/dashboard/memberships/${record.relatedMembershipId}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Membership
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Metadata */}
      {activeTab === "metadata" && (
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-muted/30">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              System Metadata
            </p>
          </div>
          <div className="divide-y divide-border text-xs">
            {[
              { label: "Record ID", value: record.id, icon: <Hash className="h-3.5 w-3.5" /> },
              { label: "Club ID", value: record.clubId, icon: <Banknote className="h-3.5 w-3.5" /> },
              { label: "Type", value: record.type, icon: <Tag className="h-3.5 w-3.5" /> },
              { label: "Category", value: record.category, icon: <Tag className="h-3.5 w-3.5" /> },
              { label: "Currency", value: record.currency, icon: <Banknote className="h-3.5 w-3.5" /> },
              { label: "Record Date", value: record.recordDate, icon: <Calendar className="h-3.5 w-3.5" /> },
              { label: "Created At", value: new Date(record.createdAt).toLocaleString(), icon: <Clock className="h-3.5 w-3.5" /> },
              ...(record.relatedTransferId
                ? [{ label: "Related Transfer ID", value: record.relatedTransferId, icon: <ExternalLink className="h-3.5 w-3.5" /> }]
                : []),
              ...(record.relatedMembershipId
                ? [{ label: "Related Membership ID", value: record.relatedMembershipId, icon: <ExternalLink className="h-3.5 w-3.5" /> }]
                : []),
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3.5">
                <span className="flex items-center gap-2 text-muted-foreground font-medium">
                  {icon}
                  {label}
                </span>
                <span className="font-mono text-foreground text-[11px] font-semibold">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        title="Delete Financial Record"
        description={`Are you sure you want to delete "${record.description}"? This action cannot be undone.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        isDestructive
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate(record.id, {
            onSuccess: () => {
              setIsConfirmDeleteOpen(false);
              router.push("/dashboard/finance");
            },
          });
        }}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />
    </div>
  );
}

export default function FinanceRecordDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
          Loading record...
        </div>
      }
    >
      <FinanceRecordDetailContent />
    </Suspense>
  );
}

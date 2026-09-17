"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  User,
  Trash2,
  TrendingUp,
  TrendingDown,
  ExternalLink,
} from "lucide-react";
import type { FinancialRecord } from "@/types/finance.types";

interface RecordDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: FinancialRecord | null;
  onDeleteRecord?: (recordId: string) => void;
}

export function RecordDetailDrawer({
  isOpen,
  onClose,
  record,
  onDeleteRecord,
}: RecordDetailDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !record) return null;

  const isIncome = record.type === "INCOME";

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: record.currency || "USD",
    minimumFractionDigits: record.amount % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(record.amount);

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
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Financial Record Details"
          className="w-screen max-w-md bg-card border-l border-border shadow-2xl text-card-foreground animate-in slide-in-from-right duration-250 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
                  isIncome
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-danger/10 text-danger border-danger/20"
                }`}
              >
                {isIncome ? (
                  <TrendingUp className="h-6 w-6" />
                ) : (
                  <TrendingDown className="h-6 w-6" />
                )}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Financial Record
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isIncome
                        ? "bg-primary-subtle text-primary border border-primary/20"
                        : "bg-danger/10 text-danger border border-danger/20"
                    }`}
                  >
                    {record.type}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {record.recordDate}
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
            {/* Amount Banner */}
            <div
              className={`rounded-2xl border p-5 text-center space-y-1 ${
                isIncome
                  ? "bg-primary-subtle border-primary/20 text-primary"
                  : "bg-danger/10 border-danger/20 text-danger"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider">
                Transaction Value
              </p>
              <p className="text-3xl font-extrabold tracking-tight">
                {isIncome ? "+" : "-"}
                {formattedAmount}
              </p>
            </div>

            {/* Transaction Details */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Record Breakdown
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 text-foreground">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Description</p>
                    <p className="text-muted-foreground">{record.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" /> Category
                  </span>
                  <span className="font-semibold text-foreground rounded-md bg-secondary/80 px-2 py-0.5 text-[11px]">
                    {record.category.replace(/_/g, " ")}
                  </span>
                </div>

                {record.linkedEntityName && (
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" /> Linked Entity / Member
                    </span>
                    <span className="font-semibold text-foreground">
                      {record.linkedEntityName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3">
            {onDeleteRecord ? (
              <button
                type="button"
                onClick={() => onDeleteRecord(record.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Record
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/finance/${record.id}`}
                replace
                onClick={onClose}
                className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View Full Page
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

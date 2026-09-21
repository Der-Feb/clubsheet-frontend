"use client";

import { useState, useEffect } from "react";
import { X, Plus, DollarSign, Calendar, Tag, FileText, User } from "lucide-react";
import { useMembers } from "@/hooks/use-members-roles.hook";
import type {
  FinancialRecordType,
  FinancialCategory,
} from "@/types/finance.types";

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRecord: (data: {
    type: FinancialRecordType;
    category: FinancialCategory;
    amount: number;
    currency: string;
    description: string;
    recordDate: string;
    linkedEntityName?: string;
  }) => void;
  isLoading?: boolean;
}

export function AddRecordModal({
  isOpen,
  onClose,
  onCreateRecord,
  isLoading = false,
}: AddRecordModalProps) {
  const { data: members = [] } = useMembers();

  const [type, setType] = useState<FinancialRecordType>("INCOME");
  const [category, setCategory] = useState<FinancialCategory>("SPONSORSHIP");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [description, setDescription] = useState<string>("");
  const getTodayLocalDateStr = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const [recordDate, setRecordDate] = useState<string>(getTodayLocalDateStr());
  const [linkedEntityName, setLinkedEntityName] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setType("INCOME");
      setCategory("SPONSORSHIP");
      setAmount("");
      setCurrency("USD");
      setDescription("");
      setRecordDate(getTodayLocalDateStr());
      setLinkedEntityName("");
      setError("");
    }
  }, [isOpen]);

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
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid positive amount");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    onCreateRecord({
      type,
      category,
      amount: numAmount,
      currency,
      description: description.trim(),
      recordDate,
      linkedEntityName: linkedEntityName.trim() || undefined,
    });
  };

  const categories: { label: string; value: FinancialCategory }[] = [
    { label: "Sponsorship", value: "SPONSORSHIP" },
    { label: "Transfer Fee", value: "TRANSFER_FEE" },
    { label: "Ticket Sales", value: "TICKET_SALES" },
    { label: "Salary Payroll", value: "SALARY" },
    { label: "Merchandise", value: "MERCHANDISE" },
    { label: "Facility Lease & Care", value: "FACILITY" },
    { label: "Other Operations", value: "OTHER" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-record-title"
        className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h2 id="add-record-title" className="text-base font-bold text-foreground">
              Add Financial Record
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Income vs Expense Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Record Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/50 border border-border">
              <button
                type="button"
                onClick={() => {
                  setType("INCOME");
                  if (category === "SALARY") setCategory("SPONSORSHIP");
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  type === "INCOME"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                + Income (Revenue)
              </button>
              <button
                type="button"
                onClick={() => {
                  setType("EXPENSE");
                  if (category === "SPONSORSHIP" || category === "TICKET_SALES")
                    setCategory("SALARY");
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  type === "EXPENSE"
                    ? "bg-danger text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                - Expense (Cost)
              </button>
            </div>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Amount <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="e.g. 25000"
                  className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-3 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="RWF">RWF (FRw)</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FinancialCategory)}
              className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Record Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Record Date
            </label>
            <input
              type="date"
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              Description <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Q3 Sponsorship Tranche or Turf Maintenance Fee"
              className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Linked Member / Entity (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Linked Staff Member / Entity (Optional)
            </label>
            <select
              value={linkedEntityName}
              onChange={(e) => setLinkedEntityName(e.target.value)}
              className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">None / Club-wide</option>
              {members.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-[11px] text-danger">{error}</p>}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              {isLoading ? "Saving..." : "Add Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

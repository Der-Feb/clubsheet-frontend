"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, DollarSign, Calendar, Briefcase } from "lucide-react";
import type { HireRole } from "@/types/hires.types";
import type { SalaryPeriod } from "@/types/contracts.types";

interface NewHireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateHire: (data: {
    personName: string;
    personEmail?: string;
    role: HireRole;
    contractLengthMonths: number;
    salaryAmount: number;
    salaryPeriod: SalaryPeriod;
    signingBonus: number;
    startDate: string;
  }) => void;
  isLoading?: boolean;
}

const HIRE_ROLES: HireRole[] = [
  "Coach",
  "Technical Staff",
  "Medical Staff",
  "Operations",
  "Executive",
];

export function NewHireModal({
  isOpen,
  onClose,
  onCreateHire,
  isLoading = false,
}: NewHireModalProps) {
  const [personName, setPersonName] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [role, setRole] = useState<HireRole>("Coach");
  const [contractLengthMonths, setContractLengthMonths] = useState<number>(24);
  const [salaryAmount, setSalaryAmount] = useState<number>(5000);
  const [salaryPeriod, setSalaryPeriod] = useState<SalaryPeriod>("MONTHLY");
  const [signingBonus, setSigningBonus] = useState<number>(5000);
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (!isOpen) {
      setPersonName("");
      setPersonEmail("");
      setRole("Coach");
      setContractLengthMonths(24);
      setSalaryAmount(5000);
      setSalaryPeriod("MONTHLY");
      setSigningBonus(5000);
      setStartDate(new Date().toISOString().split("T")[0]);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim()) return;

    onCreateHire({
      personName: personName.trim(),
      personEmail: personEmail.trim() || undefined,
      role,
      contractLengthMonths: Number(contractLengthMonths) || 12,
      salaryAmount: Number(salaryAmount) || 0,
      salaryPeriod,
      signingBonus: Number(signingBonus) || 0,
      startDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Window */}
        <div
          className="relative w-full max-w-xl rounded-2xl bg-card border border-border shadow-2xl text-card-foreground animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Pinned Header */}
          <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  New Direct Hire
                </h2>
                <p className="text-xs text-muted-foreground">
                  Create direct staff contract and dispatch invitation.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <form id="new-hire-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Person Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                Staff Member Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-foreground">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thierry Henry, Dr. Rutayisire"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="staff@club.com"
                    value={personEmail}
                    onChange={(e) => setPersonEmail(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Staff Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as HireRole)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                  >
                    {HIRE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contract Terms */}
            <div className="space-y-3 pt-2 border-t border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                Contract & Compensation Terms
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Contract Length (Months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={contractLengthMonths}
                    onChange={(e) => setContractLengthMonths(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Contract Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Salary Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={salaryAmount}
                    onChange={(e) => setSalaryAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">
                    Salary Period
                  </label>
                  <select
                    value={salaryPeriod}
                    onChange={(e) => setSalaryPeriod(e.target.value as SalaryPeriod)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="WEEKLY">Weekly</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-foreground">
                    Signing Bonus ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={signingBonus}
                    onChange={(e) => setSigningBonus(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Immediately committed to financial ledger as club expense.
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* Pinned Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-card shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="new-hire-form"
              disabled={isLoading || !personName.trim()}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Creating..." : "Create Direct Hire"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

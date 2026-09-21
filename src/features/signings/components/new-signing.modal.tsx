"use client";

import { useState, useEffect } from "react";
import { X, FileSignature, DollarSign, Calendar, Plus, Trash2 } from "lucide-react";
import type { SalaryPeriod, OtherFeeItem } from "@/types/contracts.types";

interface NewSigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSigning: (data: {
    athleteName: string;
    contractLengthMonths: number;
    salaryAmount: number;
    salaryPeriod: SalaryPeriod;
    signingBonus: number;
    effectiveDate: string;
    performanceAddOn?: number;
    sellOnClause?: number;
    otherFees?: OtherFeeItem[];
    registrationWindowOpen?: boolean;
  }) => void;
  isLoading?: boolean;
}

export function NewSigningModal({
  isOpen,
  onClose,
  onCreateSigning,
  isLoading = false,
}: NewSigningModalProps) {
  const [athleteName, setAthleteName] = useState("");
  const [contractLengthMonths, setContractLengthMonths] = useState<number>(36);
  const [salaryAmount, setSalaryAmount] = useState<number>(7500);
  const [salaryPeriod, setSalaryPeriod] = useState<SalaryPeriod>("MONTHLY");
  const [signingBonus, setSigningBonus] = useState<number>(10000);
  const [effectiveDate, setEffectiveDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [performanceAddOn, setPerformanceAddOn] = useState<string>("");
  const [sellOnClause, setSellOnClause] = useState<string>("");
  const [registrationWindowOpen, setRegistrationWindowOpen] = useState(true);

  // Dynamic Custom Fees
  const [otherFees, setOtherFees] = useState<
    Array<{ id: string; name: string; amount: number }>
  >([]);

  useEffect(() => {
    if (!isOpen) {
      setAthleteName("");
      setContractLengthMonths(36);
      setSalaryAmount(7500);
      setSalaryPeriod("MONTHLY");
      setSigningBonus(10000);
      setEffectiveDate(new Date().toISOString().split("T")[0]);
      setPerformanceAddOn("");
      setSellOnClause("");
      setRegistrationWindowOpen(true);
      setOtherFees([]);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddFee = () => {
    setOtherFees((prev) => [
      ...prev,
      { id: `fee-${Date.now()}-${Math.random()}`, name: "", amount: 0 },
    ]);
  };

  const handleRemoveFee = (id: string) => {
    setOtherFees((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpdateFee = (
    id: string,
    field: "name" | "amount",
    value: string | number
  ) => {
    setOtherFees((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!athleteName.trim()) return;

    const validOtherFees: OtherFeeItem[] = otherFees
      .filter((f) => f.name.trim() !== "" && f.amount > 0)
      .map((f) => ({ name: f.name.trim(), amount: f.amount }));

    onCreateSigning({
      athleteName: athleteName.trim(),
      contractLengthMonths: Number(contractLengthMonths) || 12,
      salaryAmount: Number(salaryAmount) || 0,
      salaryPeriod,
      signingBonus: Number(signingBonus) || 0,
      effectiveDate: effectiveDate || new Date().toISOString().split("T")[0],
      performanceAddOn: performanceAddOn ? Number(performanceAddOn) : undefined,
      sellOnClause: sellOnClause ? Number(sellOnClause) : undefined,
      otherFees: validOtherFees.length > 0 ? validOtherFees : undefined,
      registrationWindowOpen,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-180 max-h-[85vh] flex flex-col rounded-2xl bg-card border border-border p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-card-foreground">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-primary/10 p-2 text-primary border border-primary/20">
              <FileSignature className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                New Athlete Signing
              </h2>
              <p className="text-xs text-muted-foreground">
                Initiate a new contract offer and financial commitment.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs pr-1">
            {/* Athlete Name */}
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Athlete Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Thierry Manzi"
                value={athleteName}
                onChange={(e) => setAthleteName(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Contract Length & Effective Date */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Contract Length (Months)
                </label>
                <select
                  value={contractLengthMonths}
                  onChange={(e) => setContractLengthMonths(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={24}>24 Months (2 Years)</option>
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={48}>48 Months (4 Years)</option>
                  <option value={60}>60 Months (5 Years)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground mb-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Effective Date
                </label>
                <input
                  type="date"
                  required
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Salary Amount & Period */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="font-semibold text-foreground mb-1 flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  Salary Amount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  value={salaryAmount}
                  onChange={(e) => setSalaryAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Period
                </label>
                <select
                  value={salaryPeriod}
                  onChange={(e) => setSalaryPeriod(e.target.value as SalaryPeriod)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="WEEKLY">Weekly</option>
                </select>
              </div>
            </div>

            {/* Signing Bonus */}
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Signing Bonus ($)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={signingBonus}
                onChange={(e) => setSigningBonus(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Creating this signing immediately records an Expense record in Club Finance for this bonus.
              </p>
            </div>

            {/* Performance Add-On & Sell-On Clause */}
            <div className="grid grid-cols-1 gap-3 pt-1 border-t border-border sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Performance Add-On ($)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Optional bonus"
                  value={performanceAddOn}
                  onChange={(e) => setPerformanceAddOn(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  Sell-On Clause (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 15%"
                  value={sellOnClause}
                  onChange={(e) => setSellOnClause(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Additional Custom Fees Section */}
            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block font-semibold text-foreground">
                    Additional Fees & Commissions
                  </label>
                  <p className="text-[11px] text-muted-foreground">
                    Add custom fees (e.g. Agent Fee, Medical Fee, Relocation).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFee}
                  className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-muted cursor-pointer transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Fee
                </button>
              </div>

              {otherFees.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {otherFees.map((fee) => (
                    <div key={fee.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Fee Name (e.g. Agent Commission)"
                        value={fee.name}
                        onChange={(e) =>
                          handleUpdateFee(fee.id, "name", e.target.value)
                        }
                        className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <input
                        type="number"
                        min="0"
                        step="100"
                        placeholder="Amount ($)"
                        value={fee.amount || ""}
                        onChange={(e) =>
                          handleUpdateFee(fee.id, "amount", Number(e.target.value))
                        }
                        className="w-28 rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFee(fee.id)}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                        title="Remove Fee"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Registration Window Checkbox */}
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={registrationWindowOpen}
                  onChange={(e) => setRegistrationWindowOpen(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-foreground">
                    Transfer / Registration Window is Currently Open
                  </span>
                  <p className="text-[11px] text-muted-foreground">
                    If unchecked, accepting this contract will place the signing in <span className="font-medium text-amber-500">PENDING_REGISTRATION</span> state with a warning banner.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions - Pinned at bottom */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !athleteName.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs disabled:opacity-50 cursor-pointer transition-colors"
            >
              {isLoading ? "Creating..." : "Create Signing Offer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

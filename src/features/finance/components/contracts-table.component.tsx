"use client";

import Link from "next/link";
import { DollarSign, Calendar, Users, Calculator } from "lucide-react";
import type { Contract } from "@/types/finance.types";

interface ContractsTableProps {
  contracts: Contract[];
}

export function ContractsTable({ contracts }: ContractsTableProps) {
  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-card-foreground">
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Calculator className="h-4.5 w-4.5 text-primary" />
            Active Contracts & Monthly Amortization Schedule
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Read-only breakdown of active staff and player payroll and transfer fee amortization costs.
          </p>
        </div>
        <span className="rounded-full bg-primary-subtle text-primary border border-primary/20 px-3 py-1 text-xs font-semibold self-start sm:self-auto">
          {contracts.length} Active Contracts
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs text-card-foreground">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Member / Staff</th>
                <th className="py-3 px-4">Salary & Period</th>
                <th className="py-3 px-4">Transfer Fee</th>
                <th className="py-3 px-4">Amortization Period</th>
                <th className="py-3 px-4 text-right">Computed Monthly Amortized Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {contracts.map((contract) => {
                const monthlySalary =
                  contract.salaryPeriod === "MONTHLY"
                    ? contract.salaryAmount
                    : contract.salaryAmount * 4.33;

                const monthlyAmortizationFee =
                  contract.transferFee && contract.amortizationMonths
                    ? contract.transferFee / contract.amortizationMonths
                    : 0;

                const totalMonthlyCost = Math.round(
                  monthlySalary + monthlyAmortizationFee
                );

                return (
                  <tr key={contract.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted border border-border text-[11px] font-bold text-foreground">
                          {contract.memberName
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <Link
                          href={`/dashboard/memberships/${contract.membershipId}`}
                          className="hover:text-primary hover:underline"
                        >
                          {contract.memberName}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-foreground">
                        {formatCurrency(contract.salaryAmount)}
                      </span>
                      <span className="text-[11px] text-muted-foreground ml-1">
                        / {contract.salaryPeriod.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-medium">
                      {contract.transferFee
                        ? formatCurrency(contract.transferFee)
                        : "-"}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {contract.amortizationMonths
                        ? `${contract.amortizationMonths} months`
                        : "-"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="space-y-0.5">
                        <span className="font-bold text-primary">
                          {formatCurrency(totalMonthlyCost)} / mo
                        </span>
                        {monthlyAmortizationFee > 0 && (
                          <p className="text-[10px] text-muted-foreground">
                            (Salary: {formatCurrency(Math.round(monthlySalary))} + Fee Amort: {formatCurrency(Math.round(monthlyAmortizationFee))})
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {contracts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                    No active contracts configured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

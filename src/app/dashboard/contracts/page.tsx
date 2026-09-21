"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  FileSignature,
  Briefcase,
  Eye,
  ExternalLink,
  MoreVertical,
  Ban,
  X,
  AlertTriangle,
  Gift,
} from "lucide-react";
import { useContracts, useTerminateContract } from "@/hooks/use-contracts.hook";
import { useSignings } from "@/hooks/use-signings.hook";
import { useHires } from "@/hooks/use-hires.hook";
import { useMembers } from "@/hooks/use-members-roles.hook";
import type { Contract } from "@/types/contracts.types";
import { ContractDetailDrawer } from "@/features/contracts/components/contract-detail.drawer";

function ContractsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"ALL" | "SIGNING" | "HIRE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [openKebabId, setOpenKebabId] = useState<string | null>(null);

  const { data: contracts = [], isLoading } = useContracts();
  const { data: signings = [] } = useSignings();
  const { data: hires = [] } = useHires();
  const { data: members = [] } = useMembers();

  const terminateContractMutation = useTerminateContract();

  // URL state
  const selectedContractId = searchParams.get("contractId");
  const selectedContract = selectedContractId
    ? contracts.find((c) => c.id === selectedContractId) || null
    : null;

  // Helper to resolve entity metadata
  const getContractMeta = (contract: Contract) => {
    const signing = contract.signingId
      ? signings.find((s) => s.id === contract.signingId || s.contractId === contract.id)
      : null;
    const hire = contract.hireId
      ? hires.find((h) => h.id === contract.hireId || h.contractId === contract.id)
      : null;
    const member = members.find((m) => m.id === contract.membershipId);

    const personName =
      signing?.athleteName ||
      hire?.personName ||
      member?.name ||
      "Contract Holder";

    const role = signing
      ? "Athlete"
      : hire
      ? hire.role
      : member?.role || "Staff Member";

    const origin: "Signing" | "Direct Hire" = contract.signingId
      ? "Signing"
      : "Direct Hire";

    return { personName, role, origin, signing, hire };
  };

  // Stat calculations
  const activeCount = contracts.length;

  const totalMonthlyPayroll = contracts.reduce((sum, c) => {
    return (
      sum +
      (c.salaryPeriod === "WEEKLY" ? c.salaryAmount * 4.33 : c.salaryAmount)
    );
  }, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalBonusesThisMonth = contracts
    .filter((c) => c.createdAt.startsWith(currentMonth))
    .reduce((sum, c) => sum + (c.signingBonus || 0), 0);

  const expiringCount = contracts.filter((c) => {
    if (!c.startDate) return false;
    const start = new Date(c.startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + c.lengthMonths);
    const in30Days = new Date(Date.now() + 30 * 86400000);
    return end <= in30Days && end >= new Date();
  }).length;

  const handleOpenDrawer = (contract: Contract) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("contractId", contract.id);
    router.push(`?${params.toString()}`);
  };

  const handleCloseDrawer = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("contractId");
    router.push(params.toString() ? `?${params.toString()}` : "/dashboard/contracts");
  };

  const handleTerminate = (contractId: string) => {
    terminateContractMutation.mutate(contractId, {
      onSuccess: () => setOpenKebabId(null),
    });
  };

  // Close kebab on click outside
  useEffect(() => {
    const handleClickOutside = () => setOpenKebabId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Filter contracts
  const filteredContracts = contracts.filter((contract) => {
    const { personName, role, origin } = getContractMeta(contract);

    if (activeTab === "SIGNING" && origin !== "Signing") return false;
    if (activeTab === "HIRE" && origin !== "Direct Hire") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        personName.toLowerCase().includes(q) ||
        role.toLowerCase().includes(q) ||
        contract.id.toLowerCase().includes(q) ||
        origin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Contracts
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            System of record — active contracts originated from Signings or Direct Hires
          </p>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Contracts */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Contracts</span>
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{activeCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Club commitment portfolio</p>
        </div>

        {/* Total Monthly Payroll */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Monthly Payroll</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalMonthlyPayroll)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Base salary commitment</p>
        </div>

        {/* Expiring in 30 Days */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Expiring in 30 Days</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-500">{expiringCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Renewal reviews required</p>
        </div>

        {/* Signing Bonuses This Month */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Signing Bonuses</span>
            <div className="rounded-xl bg-purple-500/10 p-2 text-purple-500">
              <Gift className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(totalBonusesThisMonth)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Committed this month</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-muted/30 p-1">
          {(
            [
              { id: "ALL", label: "All Contracts" },
              { id: "SIGNING", label: "From Signing" },
              { id: "HIRE", label: "From Direct Hire" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-input bg-background pl-9 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Contracts Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Person</th>
                <th className="px-4 py-3">Role / Type</th>
                <th className="px-4 py-3">Origin</th>
                <th className="px-4 py-3">Length</th>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3">Signing Bonus</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Loading contracts...
                  </td>
                </tr>
              ) : filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    No contracts found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => {
                  const isKebabOpen = openKebabId === contract.id;
                  const { personName, role, origin, signing, hire } = getContractMeta(contract);

                  return (
                    <tr
                      key={contract.id}
                      className="hover:bg-muted/20 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDrawer(contract)}
                    >
                      {/* Person */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                            {personName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <span className="font-bold text-foreground block">
                              {personName}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {contract.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5 font-medium text-foreground">
                        {role}
                      </td>

                      {/* Origin Badge */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                            origin === "Signing"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {origin === "Signing" ? (
                            <FileSignature className="h-3 w-3" />
                          ) : (
                            <Briefcase className="h-3 w-3" />
                          )}
                          {origin}
                        </span>
                      </td>

                      {/* Length */}
                      <td className="px-4 py-3.5 font-medium text-foreground">
                        {contract.lengthMonths} Months
                        <span className="text-[11px] text-muted-foreground block">
                          ({(contract.lengthMonths / 12).toFixed(1)} yrs)
                        </span>
                      </td>

                      {/* Salary */}
                      <td className="px-4 py-3.5 font-semibold text-foreground">
                        {formatCurrency(contract.salaryAmount)}
                        <span className="text-[11px] text-muted-foreground block font-normal capitalize">
                          {contract.salaryPeriod.toLowerCase()}
                        </span>
                      </td>

                      {/* Signing Bonus */}
                      <td className="px-4 py-3.5 font-bold text-emerald-500">
                        {formatCurrency(contract.signingBonus)}
                      </td>

                      {/* Start Date */}
                      <td className="px-4 py-3.5 text-muted-foreground font-medium whitespace-nowrap">
                        {contract.startDate || "Immediate"}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3.5 text-right whitespace-nowrap relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenDrawer(contract)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            title="Quick View Drawer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <Link
                            href={`/dashboard/contracts/${contract.id}`}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            title="View Full Page"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          {/* Kebab toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenKebabId(isKebabOpen ? null : contract.id);
                            }}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Kebab Dropdown Menu */}
                        {isKebabOpen && (
                          <div
                            className="absolute right-4 top-10 z-30 w-44 rounded-xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 text-left"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                handleOpenDrawer(contract);
                                setOpenKebabId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              View Terms
                            </button>

                            {signing && (
                              <Link
                                href={`/dashboard/signings/${signing.id}`}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted cursor-pointer"
                              >
                                <FileSignature className="h-3.5 w-3.5 text-muted-foreground" />
                                View Signing
                              </Link>
                            )}

                            {hire && (
                              <Link
                                href={`/dashboard/hires/${hire.id}`}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted cursor-pointer"
                              >
                                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                                View Direct Hire
                              </Link>
                            )}

                            <button
                              type="button"
                              onClick={() => handleTerminate(contract.id)}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Ban className="h-3.5 w-3.5" />
                              Terminate Contract
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Detail Drawer */}
      <ContractDetailDrawer
        isOpen={Boolean(selectedContract)}
        onClose={handleCloseDrawer}
        contract={selectedContract}
        onTerminate={handleTerminate}
        isTerminating={terminateContractMutation.isPending}
      />
    </div>
  );
}

export default function ContractsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
          Loading contracts...
        </div>
      }
    >
      <ContractsContent />
    </Suspense>
  );
}

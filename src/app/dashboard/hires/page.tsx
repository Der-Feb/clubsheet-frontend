"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  UserCheck,
  Eye,
  ExternalLink,
  MoreVertical,
  Send,
  Ban,
  X,
  FileCheck,
} from "lucide-react";
import {
  useHires,
  useCreateHire,
  useAcceptHireInvitation,
  useResendHireInvitation,
  useTerminateHire,
} from "@/hooks/use-hires.hook";
import { getContract } from "@/hooks/use-contracts.hook";
import type { DirectHire, HireStatus, HireRole } from "@/types/hires.types";
import { NewHireModal } from "@/features/hires/components/new-hire.modal";
import { HireDetailDrawer } from "@/features/hires/components/hire-detail.drawer";

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

function HiresContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<HireStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [openKebabId, setOpenKebabId] = useState<string | null>(null);

  const { data: hires = [], isLoading } = useHires();
  const createHireMutation = useCreateHire();
  const acceptInvitationMutation = useAcceptHireInvitation();
  const resendInvitationMutation = useResendHireInvitation();
  const terminateHireMutation = useTerminateHire();

  // URL State
  const selectedHireId = searchParams.get("hireId");
  const isNewHireModalOpen = searchParams.get("newHire") === "active";

  const selectedHire = selectedHireId
    ? hires.find((h) => h.id === selectedHireId) || null
    : null;

  // Stat calculations
  const pendingCount = hires.filter((h) => h.status === "INVITED").length;
  const activeCount = hires.filter((h) => h.status === "ACTIVE").length;

  const totalPayroll = hires
    .filter((h) => h.status === "ACTIVE")
    .reduce((sum, h) => {
      const contract = getContract(h.contractId);
      if (!contract) return sum;
      return sum + (contract.salaryPeriod === "WEEKLY" ? contract.salaryAmount * 4.33 : contract.salaryAmount);
    }, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const newThisMonthCount = hires.filter((h) => h.createdAt.startsWith(currentMonth)).length;

  const handleOpenModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("newHire", "active");
    router.push(`?${params.toString()}`);
  };

  const handleCloseModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("newHire");
    router.push(params.toString() ? `?${params.toString()}` : "/dashboard/hires");
  };

  const handleOpenDrawer = (hire: DirectHire) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("hireId", hire.id);
    router.push(`?${params.toString()}`);
  };

  const handleCloseDrawer = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("hireId");
    router.push(params.toString() ? `?${params.toString()}` : "/dashboard/hires");
  };

  const handleCreateHire = (data: {
    personName: string;
    personEmail?: string;
    role: HireRole;
    contractLengthMonths: number;
    salaryAmount: number;
    salaryPeriod: "MONTHLY" | "WEEKLY";
    signingBonus: number;
    startDate: string;
  }) => {
    createHireMutation.mutate(data, {
      onSuccess: (newHire) => {
        handleCloseModal();
        handleOpenDrawer(newHire);
      },
    });
  };

  const handleAccept = (hireId: string) => {
    acceptInvitationMutation.mutate(hireId, {
      onSuccess: () => setOpenKebabId(null),
    });
  };

  const handleResend = (hireId: string) => {
    resendInvitationMutation.mutate(hireId, {
      onSuccess: () => setOpenKebabId(null),
    });
  };

  const handleTerminate = (hireId: string) => {
    terminateHireMutation.mutate(hireId, {
      onSuccess: () => setOpenKebabId(null),
    });
  };

  // Close kebab on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenKebabId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Filter hires
  const filteredHires = hires.filter((hire) => {
    if (activeTab !== "ALL" && hire.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        hire.personName.toLowerCase().includes(q) ||
        hire.role.toLowerCase().includes(q) ||
        (hire.personEmail && hire.personEmail.toLowerCase().includes(q))
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
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Staff & Coaches
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Direct hires — contracts without the transfer pipeline
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Hire
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Pending Invitations */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Pending Invitations</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-500">{pendingCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Awaiting staff response</p>
        </div>

        {/* Active Staff Contracts */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Staff Contracts</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Active staff members</p>
        </div>

        {/* Total Monthly Payroll */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Staff Payroll</span>
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{formatCurrency(totalPayroll)}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Monthly staff commitment</p>
        </div>

        {/* New This Month */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">New This Month</span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-500">{newThisMonthCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Created in {new Date().toLocaleString("en-US", { month: "short" })}</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-muted/30 p-1">
          {(
            [
              { id: "ALL", label: "All Hires" },
              { id: "INVITED", label: "Invited" },
              { id: "ACTIVE", label: "Active" },
              { id: "TERMINATED", label: "Terminated" },
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
            placeholder="Search staff & coaches..."
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

      {/* Hires Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Contract Length</th>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Loading direct hires...
                  </td>
                </tr>
              ) : filteredHires.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No staff or coach hires found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredHires.map((hire) => {
                  const isKebabOpen = openKebabId === hire.id;
                  const contract = getContract(hire.contractId);

                  return (
                    <tr
                      key={hire.id}
                      className="hover:bg-muted/20 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDrawer(hire)}
                    >
                      {/* Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                            {hire.personName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <span className="font-bold text-foreground block">
                              {hire.personName}
                            </span>
                            {hire.personEmail && (
                              <span className="text-[11px] text-muted-foreground">
                                {hire.personEmail}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5 font-medium text-foreground">
                        {hire.role}
                      </td>

                      {/* Contract Length */}
                      <td className="px-4 py-3.5 font-medium text-foreground">
                        {contract ? `${contract.lengthMonths} Months` : "—"}
                        {contract && (
                          <span className="text-[11px] text-muted-foreground block">
                            ({(contract.lengthMonths / 12).toFixed(1)} yrs)
                          </span>
                        )}
                      </td>

                      {/* Salary */}
                      <td className="px-4 py-3.5 font-semibold text-foreground">
                        {contract ? formatCurrency(contract.salaryAmount) : "—"}
                        {contract && (
                          <span className="text-[11px] text-muted-foreground block font-normal capitalize">
                            {contract.salaryPeriod.toLowerCase()}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                            STATUS_BADGE[hire.status]?.style || STATUS_BADGE.INVITED.style
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              STATUS_BADGE[hire.status]?.dot || STATUS_BADGE.INVITED.dot
                            }`}
                          />
                          {STATUS_BADGE[hire.status]?.label || hire.status}
                        </span>
                      </td>

                      {/* Start Date */}
                      <td className="px-4 py-3.5 text-muted-foreground font-medium whitespace-nowrap">
                        {hire.startDate}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3.5 text-right whitespace-nowrap relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenDrawer(hire)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            title="Quick View Drawer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <Link
                            href={`/dashboard/hires/${hire.id}`}
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
                              setOpenKebabId(isKebabOpen ? null : hire.id);
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
                                handleOpenDrawer(hire);
                                setOpenKebabId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              View Summary
                            </button>

                            {hire.status === "INVITED" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleAccept(hire.id)}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-primary font-medium hover:bg-primary/10 cursor-pointer"
                                >
                                  <UserCheck className="h-3.5 w-3.5" />
                                  Accept Invitation
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleResend(hire.id)}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted cursor-pointer"
                                >
                                  <Send className="h-3.5 w-3.5 text-muted-foreground" />
                                  Resend Invitation
                                </button>
                              </>
                            )}

                            {hire.status === "ACTIVE" && (
                              <button
                                type="button"
                                onClick={() => handleTerminate(hire.id)}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                              >
                                <Ban className="h-3.5 w-3.5" />
                                Terminate Contract
                              </button>
                            )}
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

      {/* Drawer */}
      <HireDetailDrawer
        isOpen={Boolean(selectedHire)}
        onClose={handleCloseDrawer}
        hire={selectedHire}
        onAcceptInvitation={handleAccept}
        onResendInvitation={handleResend}
        onTerminate={handleTerminate}
        isAccepting={acceptInvitationMutation.isPending}
        isTerminating={terminateHireMutation.isPending}
      />

      {/* Create Modal */}
      <NewHireModal
        isOpen={isNewHireModalOpen}
        onClose={handleCloseModal}
        onCreateHire={handleCreateHire}
        isLoading={createHireMutation.isPending}
      />
    </div>
  );
}

export default function HiresPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
          Loading staff & coaches...
        </div>
      }
    >
      <HiresContent />
    </Suspense>
  );
}

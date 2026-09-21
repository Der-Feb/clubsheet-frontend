"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileSignature,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Eye,
  ExternalLink,
  MoreVertical,
  UserCheck,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  useSignings,
  useCreateSigning,
  useAcceptSigningInvitation,
  useRegisterSigning,
} from "@/hooks/use-signings.hook";
import type { Signing, SigningStatus, SalaryPeriod } from "@/types/signings.types";
import { NewSigningModal } from "@/features/signings/components/new-signing.modal";
import { SigningDetailDrawer } from "@/features/signings/components/signing-detail.drawer";
import { getContract } from "@/hooks/use-contracts.hook";

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

function SigningsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const signingIdParam = searchParams.get("signingId");
  const newSigningParam = searchParams.get("newSigning");

  // Filter state
  const [statusFilter, setStatusFilter] = useState<SigningStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Kebab menu state
  const [openKebabId, setOpenKebabId] = useState<string | null>(null);

  // Queries & Mutations
  const { data: allSignings = [] } = useSignings("ALL");
  const { data: signings = [], isLoading } = useSignings(statusFilter);
  const createSigningMutation = useCreateSigning();
  const acceptInvitationMutation = useAcceptSigningInvitation();
  const registerSigningMutation = useRegisterSigning();

  // Drawer & Modal state
  const [selectedSigning, setSelectedSigning] = useState<Signing | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state with URL search params
  useEffect(() => {
    if (signingIdParam) {
      const found = signings.find((s) => s.id === signingIdParam);
      if (found) {
        setSelectedSigning(found);
        setIsDrawerOpen(true);
      } else {
        setIsDrawerOpen(false);
      }
    } else {
      setIsDrawerOpen(false);
    }

    if (newSigningParam === "active" || newSigningParam === "true") {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [signingIdParam, newSigningParam, signings]);

  // Client search filter
  const filteredSignings = signings.filter((s) => {
    if (!searchQuery) return true;
    return s.athleteName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate stats
  const totalCount = allSignings.length;
  const awaitingCount = allSignings.filter((s) => s.status === "AWAITING_ACCEPTANCE").length;
  const pendingRegCount = allSignings.filter((s) => s.status === "PENDING_REGISTRATION").length;
  const registeredCount = allSignings.filter((s) => s.status === "REGISTERED").length;

  // Handlers with URL param sync
  const handleOpenDrawer = (signing: Signing) => {
    setSelectedSigning(signing);
    setIsDrawerOpen(true);
    router.push(`/dashboard/signings?signingId=${signing.id}`);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedSigning(null);
    router.push("/dashboard/signings");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    router.push("/dashboard/signings?newSigning=active");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (signingIdParam) {
      router.push(`/dashboard/signings?signingId=${signingIdParam}`);
    } else {
      router.push("/dashboard/signings");
    }
  };

  const handleCreateSigning = (data: {
    athleteName: string;
    contractLengthMonths: number;
    salaryAmount: number;
    salaryPeriod: SalaryPeriod;
    signingBonus: number;
    effectiveDate: string;
    performanceAddOn?: number;
    sellOnClause?: number;
    registrationWindowOpen?: boolean;
  }) => {
    createSigningMutation.mutate(data, {
      onSuccess: () => {
        handleCloseModal();
      },
    });
  };

  const handleAcceptInvitation = (id: string) => {
    acceptInvitationMutation.mutate(id, {
      onSuccess: () => {
        setOpenKebabId(null);
      },
    });
  };

  const handleRegisterSigning = (id: string) => {
    registerSigningMutation.mutate(id, {
      onSuccess: () => {
        setOpenKebabId(null);
      },
    });
  };

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
            <FileSignature className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Signings & Contracts
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Manage athlete contract negotiations, financial bonuses, acceptance workflows, and league registration.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Signing
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Signings */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Signings</span>
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{totalCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">All logged contracts</p>
        </div>

        {/* Awaiting Acceptance */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Awaiting Acceptance</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-500">{awaitingCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Invited, awaiting response</p>
        </div>

        {/* Pending Registration */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Pending Registration</span>
            <div className="rounded-xl bg-purple-500/10 p-2 text-purple-500">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-500">{pendingRegCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Window closed / awaiting reg</p>
        </div>

        {/* Registered */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Registered</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-500">{registeredCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Active & registered</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-muted/30 p-1">
          {(
            [
              { key: "ALL", label: "All Signings" },
              { key: "AWAITING_ACCEPTANCE", label: "Awaiting Acceptance" },
              { key: "PENDING_REGISTRATION", label: "Pending Registration" },
              { key: "REGISTERED", label: "Registered" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === tab.key
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search athlete name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Signings Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Athlete</th>
                <th className="px-4 py-3.5 font-semibold">Contract Length</th>
                <th className="px-4 py-3.5 font-semibold">Salary Terms</th>
                <th className="px-4 py-3.5 font-semibold">Signing Bonus</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5 font-semibold">Effective Date</th>
                <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Loading signing offers...
                  </td>
                </tr>
              ) : filteredSignings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No signings found matching your selected filter.
                  </td>
                </tr>
              ) : (
                filteredSignings.map((signing) => {
                  const isKebabOpen = openKebabId === signing.id;
                  const contract = getContract(signing.contractId);

                  return (
                    <tr
                      key={signing.id}
                      className="hover:bg-muted/20 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDrawer(signing)}
                    >
                      {/* Athlete */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                            {signing.athleteName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <span className="font-bold text-foreground">
                            {signing.athleteName}
                          </span>
                        </div>
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

                      {/* Signing Bonus */}
                      <td className="px-4 py-3.5 font-bold text-emerald-500">
                        {contract ? formatCurrency(contract.signingBonus) : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                            STATUS_BADGE[signing.status]?.style || STATUS_BADGE.DRAFT.style
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              STATUS_BADGE[signing.status]?.dot || STATUS_BADGE.DRAFT.dot
                            }`}
                          />
                          {STATUS_BADGE[signing.status]?.label || signing.status}
                        </span>
                      </td>

                      {/* Effective Date */}
                      <td className="px-4 py-3.5 text-muted-foreground font-medium whitespace-nowrap">
                        {signing.effectiveDate}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3.5 text-right whitespace-nowrap relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenDrawer(signing)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            title="Quick View Drawer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <Link
                            href={`/dashboard/signings/${signing.id}`}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            title="View Full Page"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          {/* Kebab menu toggle */}
                          <button
                            type="button"
                            onClick={() =>
                              setOpenKebabId(isKebabOpen ? null : signing.id)
                            }
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            title="More Actions"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Kebab Dropdown Menu */}
                        {isKebabOpen && (
                          <div className="absolute right-4 top-11 z-20 w-48 rounded-xl border border-border bg-card p-1.5 shadow-lg text-left animate-in fade-in-50 zoom-in-95">
                            <button
                              type="button"
                              onClick={() => {
                                handleOpenDrawer(signing);
                                setOpenKebabId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              View Details
                            </button>

                            {signing.status === "AWAITING_ACCEPTANCE" && (
                              <button
                                type="button"
                                onClick={() => handleAcceptInvitation(signing.id)}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 cursor-pointer"
                              >
                                <UserCheck className="h-3.5 w-3.5" />
                                Accept Invitation
                              </button>
                            )}

                            {signing.status === "PENDING_REGISTRATION" && (
                              <button
                                type="button"
                                onClick={() => handleRegisterSigning(signing.id)}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
                              >
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Register Athlete
                              </button>
                            )}

                            <Link
                              href={`/dashboard/signings/${signing.id}`}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted cursor-pointer"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Full Detail Page
                            </Link>
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
      <SigningDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        signing={selectedSigning}
        onAcceptInvitation={handleAcceptInvitation}
        onRegister={handleRegisterSigning}
        isAccepting={acceptInvitationMutation.isPending}
        isRegistering={registerSigningMutation.isPending}
      />

      {/* Modal */}
      <NewSigningModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateSigning={handleCreateSigning}
        isLoading={createSigningMutation.isPending}
      />
    </div>
  );
}

export default function SigningsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
          Loading Signings Module...
        </div>
      }
    >
      <SigningsContent />
    </Suspense>
  );
}

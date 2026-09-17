"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRightLeft,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  ExternalLink,
  MoreVertical,
  CornerDownRight,
  XCircle,
  AlertCircle,
  Banknote,
} from "lucide-react";
import {
  useTransfers,
  useCreateTransfer,
  useCounterTransferOffer,
  useAcceptTransferOffer,
  useRejectTransferOffer,
  useWithdrawTransferOffer,
} from "@/hooks/use-transfers.hook";
import type { Transfer, TransferStatus } from "@/types/transfers.types";
import { OpenTransferModal } from "@/features/transfers/components/open-transfer.modal";
import { TransferDetailDrawer } from "@/features/transfers/components/transfer-detail.drawer";

const STATUS_BADGE: Record<TransferStatus, { label: string; style: string; dot: string }> = {
  OPEN: {
    label: "Open Bid",
    style: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    dot: "bg-blue-500",
  },
  COUNTERED: {
    label: "Countered",
    style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
  },
  ACCEPTED: {
    label: "Accepted",
    style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    style: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    dot: "bg-rose-500",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    style: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
};

function TransfersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const transferIdParam = searchParams.get("transferId");
  const openTransferParam = searchParams.get("openTransfer");

  // Filters
  const [statusFilter, setStatusFilter] = useState<TransferStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Kebab menu state
  const [openKebabId, setOpenKebabId] = useState<string | null>(null);

  // Queries & Mutations
  const { data: transfers = [], isLoading } = useTransfers(statusFilter);
  const createTransferMutation = useCreateTransfer();
  const counterMutation = useCounterTransferOffer();
  const acceptMutation = useAcceptTransferOffer();
  const rejectMutation = useRejectTransferOffer();
  const withdrawMutation = useWithdrawTransferOffer();

  // Drawer & Modal State
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state with URL query parameters
  useEffect(() => {
    if (transferIdParam) {
      const found = transfers.find((t) => t.id === transferIdParam);
      if (found) {
        setSelectedTransfer(found);
        setIsDrawerOpen(true);
      } else {
        setIsDrawerOpen(false);
      }
    } else {
      setIsDrawerOpen(false);
    }

    if (openTransferParam === "active" || openTransferParam === "true") {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [transferIdParam, openTransferParam, transfers]);

  // Search filtering
  const filteredTransfers = transfers.filter((t) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      t.athleteName.toLowerCase().includes(query) ||
      t.fromClubName.toLowerCase().includes(query) ||
      t.toClubName.toLowerCase().includes(query)
    );
  });

  // Calculate Stat Cards
  const openCount = transfers.filter((t) => t.status === "OPEN").length;
  const counteredCount = transfers.filter((t) => t.status === "COUNTERED").length;
  const acceptedCount = transfers.filter((t) => t.status === "ACCEPTED").length;
  const totalValue = transfers.reduce((acc, t) => acc + t.currentOfferFee, 0);

  // URL Handlers
  const handleOpenDrawer = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setIsDrawerOpen(true);
    router.push(`/dashboard/transfers?transferId=${transfer.id}`);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTransfer(null);
    router.push("/dashboard/transfers");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    router.push("/dashboard/transfers?openTransfer=active");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (transferIdParam) {
      router.push(`/dashboard/transfers?transferId=${transferIdParam}`);
    } else {
      router.push("/dashboard/transfers");
    }
  };

  const handleCreateTransfer = (data: {
    athleteName: string;
    athletePosition?: string;
    fromClubName: string;
    toClubName: string;
    feeAmount: number;
    terms?: string;
    notes?: string;
  }) => {
    createTransferMutation.mutate(data, {
      onSuccess: () => {
        handleCloseModal();
      },
    });
  };

  const handleCounterOffer = (data: {
    transferId: string;
    feeAmount: number;
    terms?: string;
    notes?: string;
  }) => {
    counterMutation.mutate(data, {
      onSuccess: () => {
        setOpenKebabId(null);
      },
    });
  };

  const handleAcceptTransfer = (id: string) => {
    acceptMutation.mutate(id, {
      onSuccess: () => {
        setOpenKebabId(null);
      },
    });
  };

  const handleRejectTransfer = (id: string) => {
    rejectMutation.mutate(id, {
      onSuccess: () => {
        setOpenKebabId(null);
      },
    });
  };

  const handleWithdrawTransfer = (id: string) => {
    withdrawMutation.mutate(id, {
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
      {/* Breadcrumb */}
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Transfers</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Transfers
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Track and negotiate player transfers between clubs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Open Transfer
        </button>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Open Negotiations */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Open Negotiations</span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{openCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Active initial bids</p>
        </div>

        {/* Countered */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Countered</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <CornerDownRight className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-500">{counteredCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Counter-proposals active</p>
        </div>

        {/* Accepted */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Accepted</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-500">{acceptedCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Converted to signings</p>
        </div>

        {/* Total Transfer Value */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Transfer Value</span>
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <Banknote className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {formatCurrency(totalValue)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Aggregated offer fees</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-muted/30 p-1">
          {(
            [
              { key: "ALL", label: "All Transfers" },
              { key: "OPEN", label: "Open" },
              { key: "COUNTERED", label: "Countered" },
              { key: "ACCEPTED", label: "Accepted" },
              { key: "REJECTED", label: "Rejected" },
              { key: "WITHDRAWN", label: "Withdrawn" },
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
            placeholder="Search athlete or club..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Athlete</th>
                <th className="px-4 py-3.5 font-semibold">From Club</th>
                <th className="px-4 py-3.5 font-semibold">To Club</th>
                <th className="px-4 py-3.5 font-semibold">Current Offer</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5 font-semibold">Last Activity</th>
                <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Loading transfer negotiations...
                  </td>
                </tr>
              ) : filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No transfers found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((transfer) => {
                  const isKebabOpen = openKebabId === transfer.id;

                  return (
                    <tr
                      key={transfer.id}
                      className="hover:bg-muted/20 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDrawer(transfer)}
                    >
                      {/* Athlete */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                            {transfer.athleteName
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <span className="font-bold text-foreground block">
                              {transfer.athleteName}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {transfer.athletePosition || "Athlete"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* From Club */}
                      <td className="px-4 py-3.5 font-medium text-foreground">
                        {transfer.fromClubName}
                      </td>

                      {/* To Club */}
                      <td className="px-4 py-3.5 font-medium text-foreground">
                        {transfer.toClubName}
                      </td>

                      {/* Current Offer */}
                      <td className="px-4 py-3.5 font-bold text-foreground">
                        {formatCurrency(transfer.currentOfferFee)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                            STATUS_BADGE[transfer.status]?.style || STATUS_BADGE.OPEN.style
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              STATUS_BADGE[transfer.status]?.dot || STATUS_BADGE.OPEN.dot
                            }`}
                          />
                          {STATUS_BADGE[transfer.status]?.label || transfer.status}
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                        {transfer.lastActivity}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3.5 text-right whitespace-nowrap relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenDrawer(transfer)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            title="View Negotiation Drawer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <Link
                            href={`/dashboard/transfers/${transfer.id}`}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            title="Full Negotiation Page"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          {/* Kebab toggle */}
                          <button
                            type="button"
                            onClick={() =>
                              setOpenKebabId(isKebabOpen ? null : transfer.id)
                            }
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                            title="Actions"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Kebab Menu */}
                        {isKebabOpen && (
                          <div className="absolute right-4 top-11 z-20 w-48 rounded-xl border border-border bg-card p-1.5 shadow-lg text-left animate-in fade-in-50 zoom-in-95">
                            <button
                              type="button"
                              onClick={() => {
                                handleOpenDrawer(transfer);
                                setOpenKebabId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-muted cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              View Negotiation
                            </button>

                            {(transfer.status === "OPEN" || transfer.status === "COUNTERED") && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleOpenDrawer(transfer);
                                    setOpenKebabId(null);
                                  }}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-500/10 cursor-pointer"
                                >
                                  <CornerDownRight className="h-3.5 w-3.5" />
                                  Counter Offer
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleAcceptTransfer(transfer.id)}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Accept Offer
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRejectTransfer(transfer.id)}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  Reject Offer
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleWithdrawTransfer(transfer.id)}
                                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted cursor-pointer"
                                >
                                  <AlertCircle className="h-3.5 w-3.5" />
                                  Withdraw Bid
                                </button>
                              </>
                            )}

                            <Link
                              href={`/dashboard/transfers/${transfer.id}`}
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
      <TransferDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        transfer={selectedTransfer}
        onCounterOffer={handleCounterOffer}
        onAccept={handleAcceptTransfer}
        onReject={handleRejectTransfer}
        onWithdraw={handleWithdrawTransfer}
        isSubmitting={
          counterMutation.isPending ||
          acceptMutation.isPending ||
          rejectMutation.isPending ||
          withdrawMutation.isPending
        }
      />

      {/* Modal */}
      <OpenTransferModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateTransfer={handleCreateTransfer}
        isLoading={createTransferMutation.isPending}
      />
    </div>
  );
}

export default function TransfersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
          Loading Transfers Module...
        </div>
      }
    >
      <TransfersContent />
    </Suspense>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Banknote,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Scale,
  Calendar,
  Filter,
  Trash2,
  Eye,
  FileSpreadsheet,
  X,
} from "lucide-react";
import {
  useFinancialRecords,
  useFinanceSummary,
  useContracts,
  useCreateFinancialRecord,
  useDeleteFinancialRecord,
} from "@/hooks/use-finance.hook";
import type {
  FinancialRecord,
  FinancialRecordType,
  FinancialCategory,
} from "@/types/finance.types";
import { AddRecordModal } from "@/features/finance/components/add-record.modal";
import { RecordDetailDrawer } from "@/features/finance/components/record-detail.drawer";
import { ContractsTable } from "@/features/finance/components/contracts-table.component";

const CATEGORY_LABELS: Record<FinancialCategory, string> = {
  TRANSFER_FEE: "Transfer Fee",
  SALARY: "Salary",
  SPONSORSHIP: "Sponsorship",
  TICKET_SALES: "Ticket Sales",
  MERCHANDISE: "Merchandise",
  FACILITY: "Facility Costs",
  OTHER: "Other",
};

function FinanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const recordIdParam = searchParams.get("recordId");
  const addRecordParam = searchParams.get("addRecord");

  // Tab state: "RECORDS" | "CONTRACTS"
  const [activeTab, setActiveTab] = useState<"RECORDS" | "CONTRACTS">("RECORDS");

  // Filter state for records
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<FinancialRecordType | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<FinancialCategory | "ALL">("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Data queries
  const { data: records = [], isLoading: isLoadingRecords } = useFinancialRecords({
    type: typeFilter,
    category: categoryFilter,
    from: dateFrom || undefined,
    to: dateTo || undefined,
  });

  const { data: summary, isLoading: isLoadingSummary } = useFinanceSummary();
  const { data: contracts = [], isLoading: isLoadingContracts } = useContracts();

  const createRecordMutation = useCreateFinancialRecord();
  const deleteRecordMutation = useDeleteFinancialRecord();

  // Modal & Drawer state
  const [selectedRecordForDrawer, setSelectedRecordForDrawer] = useState<FinancialRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    if (recordIdParam) {
      const found = records.find((r) => r.id === recordIdParam);
      if (found) {
        setSelectedRecordForDrawer(found);
        setIsDrawerOpen(true);
      } else {
        setIsDrawerOpen(false);
      }
    } else {
      setIsDrawerOpen(false);
    }

    if (addRecordParam === "active" || addRecordParam === "true") {
      setIsAddModalOpen(true);
    } else {
      setIsAddModalOpen(false);
    }
  }, [recordIdParam, addRecordParam, records]);

  // Derived filtered records by client search
  const filteredRecords = records.filter((rec) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchDesc = rec.description.toLowerCase().includes(query);
    const matchEntity = rec.linkedEntityName?.toLowerCase().includes(query);
    const matchCategory = CATEGORY_LABELS[rec.category]?.toLowerCase().includes(query);
    return matchDesc || matchEntity || matchCategory;
  });

  // Handlers with URL param syncing
  const handleOpenDrawer = (record: FinancialRecord) => {
    setSelectedRecordForDrawer(record);
    setIsDrawerOpen(true);
    router.push(`/dashboard/finance?recordId=${record.id}`);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRecordForDrawer(null);
    router.push("/dashboard/finance");
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    router.push("/dashboard/finance?addRecord=active");
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    if (recordIdParam) {
      router.push(`/dashboard/finance?recordId=${recordIdParam}`);
    } else {
      router.push("/dashboard/finance");
    }
  };

  const handleCreateRecord = (data: {
    type: FinancialRecordType;
    category: FinancialCategory;
    amount: number;
    currency: string;
    description: string;
    recordDate: string;
    linkedEntityName?: string;
  }) => {
    createRecordMutation.mutate(data, {
      onSuccess: () => {
        handleCloseAddModal();
      },
    });
  };

  const handleDeleteRecord = (recordId: string) => {
    deleteRecordMutation.mutate(recordId, {
      onSuccess: () => {
        handleCloseDrawer();
      },
    });
  };

  const formatCurrency = (amount?: number, currency = "USD") => {
    if (amount === undefined || amount === null) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryBadgeClass = (category: FinancialCategory) => {
    switch (category) {
      case "SPONSORSHIP":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "TICKET_SALES":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "MERCHANDISE":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "TRANSFER_FEE":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "SALARY":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "FACILITY":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      default:
        return "bg-muted/60 text-muted-foreground border-border";
    }
  };

  const totalMonthlyObligations = (summary?.totalMonthlySalaries || 0) + (summary?.totalMonthlyAmortization || 0);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Banknote className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Club Finance & Accounting
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Track revenue streams, operational expenditures, monthly payroll obligations, and contract amortization.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Record
        </button>
      </div>

      {/* Finance Overview Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Total Income */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Revenue</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-500">
            {isLoadingSummary ? "..." : formatCurrency(summary?.totalIncome)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Sponsorships, tickets & sales</p>
        </div>

        {/* Total Expenses */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Expenses</span>
            <div className="rounded-xl bg-rose-500/10 p-2 text-rose-500">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-500">
            {isLoadingSummary ? "..." : formatCurrency(summary?.totalExpenses)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Facilities, fees & operational</p>
        </div>

        {/* Net Position */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Net Position</span>
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <Scale className="h-4 w-4" />
            </div>
          </div>
          <p
            className={`mt-2 text-2xl font-bold ${
              (summary?.netPosition || 0) >= 0 ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {isLoadingSummary ? "..." : formatCurrency(summary?.netPosition)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Net income balance</p>
        </div>

        {/* Monthly Obligations */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Monthly Obligations</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {isLoadingSummary ? "..." : formatCurrency(totalMonthlyObligations)}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {formatCurrency(summary?.totalMonthlySalaries)} payroll + {formatCurrency(summary?.totalMonthlyAmortization)} amort.
          </p>
        </div>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex items-center border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("RECORDS")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "RECORDS"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Financial Records ({records.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("CONTRACTS")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "CONTRACTS"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Contracts & Amortization ({contracts.length})
        </button>
      </div>

      {/* Tab 1: Financial Records */}
      {activeTab === "RECORDS" && (
        <div className="space-y-4">
          {/* Controls & Filter Bar */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Type Filter Tabs & Category Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Type Filter */}
              <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/30 p-1">
                {(["ALL", "INCOME", "EXPENSE"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setTypeFilter(tab)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      typeFilter === tab
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "ALL" ? "All Types" : tab === "INCOME" ? "Income" : "Expenses"}
                  </button>
                ))}
              </div>

              {/* Category Dropdown */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as FinancialCategory | "ALL")}
                className="h-9 rounded-xl border border-border bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="TRANSFER_FEE">Transfer Fee</option>
                <option value="SALARY">Salary</option>
                <option value="SPONSORSHIP">Sponsorship</option>
                <option value="TICKET_SALES">Ticket Sales</option>
                <option value="MERCHANDISE">Merchandise</option>
                <option value="FACILITY">Facility Costs</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Right: Date Range & Search */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Date Filters */}
              <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-1 text-xs">
                <span className="text-muted-foreground font-medium">From:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-transparent text-foreground focus:outline-none"
                />
                <span className="text-muted-foreground font-medium">To:</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-transparent text-foreground focus:outline-none"
                />
                {(dateFrom || dateTo) && (
                  <button
                    type="button"
                    onClick={() => {
                      setDateFrom("");
                      setDateTo("");
                    }}
                    className="ml-1 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Clear date filters"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3.5 font-semibold">Date</th>
                    <th className="px-4 py-3.5 font-semibold">Description</th>
                    <th className="px-4 py-3.5 font-semibold">Category</th>
                    <th className="px-4 py-3.5 font-semibold">Type</th>
                    <th className="px-4 py-3.5 font-semibold text-right">Amount</th>
                    <th className="px-4 py-3.5 font-semibold">Linked Member / Entity</th>
                    <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoadingRecords ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        Loading financial records...
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        No financial records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((rec) => {
                      const isIncome = rec.type === "INCOME";

                      return (
                        <tr
                          key={rec.id}
                          className="hover:bg-muted/20 transition-colors group cursor-pointer"
                          onClick={() => handleOpenDrawer(rec)}
                        >
                          {/* Date */}
                          <td className="px-4 py-3.5 font-medium text-muted-foreground whitespace-nowrap">
                            {rec.recordDate}
                          </td>

                          {/* Description */}
                          <td className="px-4 py-3.5 font-semibold text-foreground max-w-xs truncate">
                            {rec.description}
                          </td>

                          {/* Category Badge */}
                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getCategoryBadgeClass(
                                rec.category
                              )}`}
                            >
                              {CATEGORY_LABELS[rec.category]}
                            </span>
                          </td>

                          {/* Type Badge */}
                          <td className="px-4 py-3.5">
                            {isIncome ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-500 border border-emerald-500/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Income
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-500 border border-rose-500/20">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                Expense
                              </span>
                            )}
                          </td>

                          {/* Amount */}
                          <td
                            className={`px-4 py-3.5 font-bold text-right whitespace-nowrap ${
                              isIncome ? "text-emerald-500" : "text-rose-500"
                            }`}
                          >
                            {isIncome ? "+" : "-"}
                            {formatCurrency(rec.amount, rec.currency)}
                          </td>

                          {/* Linked Entity */}
                          <td className="px-4 py-3.5 text-foreground font-medium">
                            {rec.linkedEntityName ? (
                              <span className="inline-flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                {rec.linkedEntityName}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td
                            className="px-4 py-3.5 text-right whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenDrawer(rec)}
                                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                                title="View Record Details"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRecord(rec.id)}
                                className="rounded-lg p-1.5 text-rose-500/70 hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Contracts & Amortization */}
      {activeTab === "CONTRACTS" && (
        <ContractsTable contracts={contracts} />
      )}

      {/* Slide-out Record Detail Drawer */}
      <RecordDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        record={selectedRecordForDrawer}
        onDeleteRecord={handleDeleteRecord}
      />

      {/* Modal to Add Financial Record */}
      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onCreateRecord={handleCreateRecord}
        isLoading={createRecordMutation.isPending}
      />
    </div>
  );
}

export default function FinancePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
          Loading Finance Module...
        </div>
      }
    >
      <FinanceContent />
    </Suspense>
  );
}

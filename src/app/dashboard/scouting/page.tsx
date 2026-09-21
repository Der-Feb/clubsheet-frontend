"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Target as TargetIcon,
  Star,
  ArrowRightCircle,
  FileText,
} from "lucide-react";
import {
  useScoutingTargets,
  useCreateScoutingTarget,
  useAddScoutingReport,
  useUpdateScoutingStatus,
  useOpenTransfer,
} from "@/hooks/use-scouting.hook";
import type { ScoutingTarget, ScoutingStatus, ScoutingAttribute } from "@/types/scouting.types";
import { ScoutingActionsMenu } from "@/features/scouting/components/scouting-actions.menu";
import { AddProspectModal } from "@/features/scouting/components/add-prospect.modal";
import { AddScoutingReportModal } from "@/features/scouting/components/add-report.modal";
import { ProspectDetailDrawer } from "@/features/scouting/components/prospect-detail.drawer";

function ScoutingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const targetIdParam = searchParams.get("targetId");
  const createTargetParam = searchParams.get("createTarget");
  const addReportParam = searchParams.get("addReport");

  const { data: targets = [], isLoading } = useScoutingTargets();
  const createTargetMutation = useCreateScoutingTarget();
  const addReportMutation = useAddScoutingReport();
  const updateStatusMutation = useUpdateScoutingStatus();
  const openTransferMutation = useOpenTransfer();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState<ScoutingStatus | "ALL">("ALL");

  // Selection states
  const [selectedTargetForDrawer, setSelectedTargetForDrawer] = useState<ScoutingTarget | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedTargetForReport, setSelectedTargetForReport] = useState<ScoutingTarget | null>(null);
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);

  // Sync drawer and modals with query params
  useEffect(() => {
    // Check createTarget regardless of targets list length
    if (createTargetParam === "active" || createTargetParam === "true") {
      setIsCreateModalOpen(true);
    } else {
      setIsCreateModalOpen(false);
    }

    if (targets.length === 0) {
      setIsDrawerOpen(false);
      setIsAddReportModalOpen(false);
      return;
    }

    // Check targetId
    if (targetIdParam) {
      const found = targets.find((t) => t.id === targetIdParam);
      if (found) {
        setSelectedTargetForDrawer(found);
        setIsDrawerOpen(true);

        if (addReportParam === "active" || addReportParam === "true") {
          setSelectedTargetForReport(found);
          setIsAddReportModalOpen(true);
        } else {
          setIsAddReportModalOpen(false);
        }
      } else {
        setIsDrawerOpen(false);
        setIsAddReportModalOpen(false);
      }
    } else {
      setIsDrawerOpen(false);
      setIsAddReportModalOpen(false);
    }
  }, [targetIdParam, createTargetParam, addReportParam, targets]);

  // Derived list
  const filteredTargets = targets.filter((target) => {
    const matchesSearch =
      target.externalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      target.primaryPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (target.currentClub || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatusTab === "ALL" || target.status === selectedStatusTab;

    return matchesSearch && matchesStatus;
  });

  // Dynamic stats
  const totalTargets = targets.length;
  const watchingCount = targets.filter((t) => t.status === "WATCHING").length;
  const shortlistedCount = targets.filter((t) => t.status === "SHORTLISTED").length;
  const transferOpenedCount = targets.filter((t) => t.status === "TRANSFER_OPENED").length;
  const totalReportsCount = targets.reduce((sum, t) => sum + (t.reports?.length || 0), 0);

  // Handlers with URL query parameter syncing
  const handleOpenDrawer = (target: ScoutingTarget) => {
    setSelectedTargetForDrawer(target);
    setIsDrawerOpen(true);
    router.push(`/dashboard/scouting?targetId=${target.id}`);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTargetForDrawer(null);
    router.push("/dashboard/scouting");
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    router.push("/dashboard/scouting?createTarget=active");
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    if (targetIdParam) {
      router.push(`/dashboard/scouting?targetId=${targetIdParam}`);
    } else {
      router.push("/dashboard/scouting");
    }
  };

  const handleOpenAddReportModal = (target: ScoutingTarget) => {
    setSelectedTargetForReport(target);
    setIsAddReportModalOpen(true);
    router.push(`/dashboard/scouting?targetId=${target.id}&addReport=active`);
  };

  const handleCloseAddReportModal = () => {
    setIsAddReportModalOpen(false);
    setSelectedTargetForReport(null);
    if (selectedTargetForDrawer) {
      router.push(`/dashboard/scouting?targetId=${selectedTargetForDrawer.id}`);
    } else {
      router.push("/dashboard/scouting");
    }
  };

  // Actions
  const handleCreateTarget = (
    externalName: string,
    primaryPosition: string,
    currentClub: string,
    status: ScoutingStatus
  ) => {
    createTargetMutation.mutate(
      { externalName, primaryPosition, currentClub, status },
      {
        onSuccess: () => {
          handleCloseCreateModal();
        },
      }
    );
  };

  const handleAddReport = (reportData: {
    position: string;
    estimatedValue: number;
    notes: string;
    attributes: Record<ScoutingAttribute, number>;
  }) => {
    if (!selectedTargetForReport) return;
    addReportMutation.mutate(
      {
        targetId: selectedTargetForReport.id,
        ...reportData,
      },
      {
        onSuccess: () => {
          handleCloseAddReportModal();
        },
      }
    );
  };

  const handleShortlist = (target: ScoutingTarget) => {
    updateStatusMutation.mutate({
      targetId: target.id,
      status: "SHORTLISTED",
    });
  };

  const handleMoveToWatching = (target: ScoutingTarget) => {
    updateStatusMutation.mutate({
      targetId: target.id,
      status: "WATCHING",
    });
  };

  const handleOpenTransferAction = (target: ScoutingTarget) => {
    openTransferMutation.mutate(target.id);
  };

  const handleDropProspect = (target: ScoutingTarget) => {
    updateStatusMutation.mutate({
      targetId: target.id,
      status: "DROPPED",
    });
  };

  const getStatusBadge = (status: ScoutingStatus) => {
    switch (status) {
      case "WATCHING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Watching
          </span>
        );
      case "SHORTLISTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
            <Star className="h-3 w-3 fill-primary text-primary" />
            Shortlisted
          </span>
        );
      case "TRANSFER_OPENED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 border border-emerald-500/20">
            <ArrowRightCircle className="h-3 w-3 text-emerald-500" />
            Transfer Opened
          </span>
        );
      case "DROPPED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground border border-border">
            Dropped
          </span>
        );
    }
  };

  const getRatingBadgeClass = (rating: number | undefined) => {
    if (!rating) return "bg-muted/40 text-muted-foreground border-border";
    if (rating >= 80) return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    if (rating >= 70) return "bg-primary/15 text-primary border-primary/30";
    if (rating >= 60) return "bg-amber-500/15 text-amber-500 border-amber-500/30";
    return "bg-rose-500/15 text-rose-500 border-rose-500/30";
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TargetIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Scouting & Targets
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Track external talent prospects, file 1–99 attribute evaluations, and initiate transfers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Prospect
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Prospects</span>
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <TargetIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{totalTargets}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {watchingCount} under active watching
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Shortlisted</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Star className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{shortlistedCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Priority transfer candidates</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Transfers Opened</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <ArrowRightCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{transferOpenedCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">In active club negotiations</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Scout Reports</span>
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{totalReportsCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Completed technical evaluations</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-muted/30 p-1">
          {(["ALL", "WATCHING", "SHORTLISTED", "TRANSFER_OPENED", "DROPPED"] as const).map((tab) => {
            const labelMap = {
              ALL: "All",
              WATCHING: "Watching",
              SHORTLISTED: "Shortlisted",
              TRANSFER_OPENED: "Transfers Opened",
              DROPPED: "Dropped",
            };
            const isActive = selectedStatusTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedStatusTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {labelMap[tab]}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search prospects or clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Prospects Watchlist Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Prospect</th>
                <th className="px-4 py-3.5 font-semibold">Current Club</th>
                <th className="px-4 py-3.5 font-semibold text-center">Overall Rating (1–99)</th>
                <th className="px-4 py-3.5 font-semibold">Est. Market Value</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5 font-semibold text-center">Reports</th>
                <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Loading scouting prospects...
                  </td>
                </tr>
              ) : filteredTargets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No scouting prospects found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredTargets.map((target) => {
                  const rating = target.latestRating ?? target.reports?.[0]?.overallRating;
                  const latestReport = target.reports?.[0];

                  return (
                    <tr
                      key={target.id}
                      className="hover:bg-muted/20 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDrawer(target)}
                    >
                      {/* Prospect Name & Position */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                            {target.externalName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {target.externalName}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {target.primaryPosition}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Current Club */}
                      <td className="px-4 py-3.5 text-foreground font-medium">
                        {target.currentClub || "Free Agent / Unknown"}
                      </td>

                      {/* Overall Rating (1-99 Scale) */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-extrabold ${getRatingBadgeClass(
                            rating
                          )}`}
                        >
                          {rating ? `${rating} / 99` : "N/A"}
                        </span>
                      </td>

                      {/* Est. Market Value */}
                      <td className="px-4 py-3.5 font-semibold text-foreground">
                        {latestReport?.estimatedValue
                          ? `$${latestReport.estimatedValue.toLocaleString()}`
                          : "Unvalued"}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3.5">{getStatusBadge(target.status)}</td>

                      {/* Total Reports */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-muted text-[11px] font-bold text-foreground px-2">
                          {target.reports?.length || 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ScoutingActionsMenu
                          target={target}
                          onViewProfile={() => handleOpenDrawer(target)}
                          onAddReport={() => handleOpenAddReportModal(target)}
                          onShortlist={() => handleShortlist(target)}
                          onMoveToWatching={() => handleMoveToWatching(target)}
                          onOpenTransfer={() => handleOpenTransferAction(target)}
                          onDrop={() => handleDropProspect(target)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Drawer & Modals */}
      <ProspectDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        target={selectedTargetForDrawer}
        onAddReportClick={() => {
          if (selectedTargetForDrawer) {
            handleOpenAddReportModal(selectedTargetForDrawer);
          }
        }}
        onShortlist={() => {
          if (selectedTargetForDrawer) handleShortlist(selectedTargetForDrawer);
        }}
        onOpenTransfer={() => {
          if (selectedTargetForDrawer) handleOpenTransferAction(selectedTargetForDrawer);
        }}
        onDrop={() => {
          if (selectedTargetForDrawer) handleDropProspect(selectedTargetForDrawer);
        }}
      />

      <AddProspectModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onCreateTarget={handleCreateTarget}
        isLoading={createTargetMutation.isPending}
      />

      {selectedTargetForReport && (
        <AddScoutingReportModal
          isOpen={isAddReportModalOpen}
          onClose={handleCloseAddReportModal}
          targetName={selectedTargetForReport.externalName}
          defaultPosition={selectedTargetForReport.primaryPosition}
          onAddReport={handleAddReport}
          isLoading={addReportMutation.isPending}
        />
      )}
    </div>
  );
}

export default function ScoutingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
          Loading Scouting Module...
        </div>
      }
    >
      <ScoutingContent />
    </Suspense>
  );
}

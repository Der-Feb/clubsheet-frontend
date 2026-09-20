import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MOCK_SCOUTING_TARGETS } from "@/mocks/scouting.mock";
import type {
  ScoutingTarget,
  ScoutingReport,
  ScoutingStatus,
  ScoutingAttribute,
} from "@/types/scouting.types";

let scoutingStore: ScoutingTarget[] = [...MOCK_SCOUTING_TARGETS];

// Fetchers
async function fetchScoutingTargets(statusFilter?: ScoutingStatus | "ALL"): Promise<ScoutingTarget[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  if (!statusFilter || statusFilter === "ALL") {
    return [...scoutingStore];
  }
  return scoutingStore.filter((t) => t.status === statusFilter);
}

async function fetchScoutingTarget(targetId: string): Promise<ScoutingTarget | null> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const target = scoutingStore.find((t) => t.id === targetId);
  return target ? { ...target } : null;
}

// Query Hooks
export function useScoutingTargets(statusFilter?: ScoutingStatus | "ALL") {
  return useQuery<ScoutingTarget[]>({
    queryKey: ["scouting", statusFilter || "ALL"],
    queryFn: () => fetchScoutingTargets(statusFilter),
  });
}

export function useScoutingTarget(targetId: string) {
  return useQuery<ScoutingTarget | null>({
    queryKey: ["scoutingTarget", targetId],
    queryFn: () => fetchScoutingTarget(targetId),
    enabled: !!targetId,
  });
}

// Mutation Hooks

/** POST /clubs/:clubId/scouting */
export function useCreateScoutingTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      externalName,
      primaryPosition,
      currentClub = "Free Agent / Unknown",
      status = "WATCHING",
    }: {
      externalName: string;
      primaryPosition: string;
      currentClub?: string;
      status?: ScoutingStatus;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const newTarget: ScoutingTarget = {
        id: `scout-${Date.now()}`,
        clubId: "club-1",
        athleteId: null,
        externalName,
        currentClub,
        primaryPosition,
        status,
        addedById: "usr-current",
        addedByName: "Current Scout",
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        latestRating: undefined,
        reports: [],
      };

      scoutingStore = [newTarget, ...scoutingStore];
      return newTarget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scouting"] });
    },
  });
}

/** POST /scouting/:targetId/reports */
export function useAddScoutingReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      targetId,
      position,
      estimatedValue,
      notes,
      attributes,
    }: {
      targetId: string;
      position: string;
      estimatedValue: number;
      notes: string;
      attributes: Record<ScoutingAttribute, number>;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Calculate 1-99 overall rating as average of 6 attributes
      const attrValues = Object.values(attributes);
      const calculatedOverall = Math.round(
        attrValues.reduce((a, b) => a + b, 0) / attrValues.length
      );

      const reportId = `rep-${Date.now()}`;

      const newReport: ScoutingReport = {
        id: reportId,
        scoutingTargetId: targetId,
        scoutId: "usr-current",
        scoutName: "Current Scout",
        position,
        overallRating: calculatedOverall,
        estimatedValue,
        notes,
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        attributes: (Object.keys(attributes) as ScoutingAttribute[]).map(
          (attr, idx) => ({
            id: `att-${Date.now()}-${idx}`,
            reportId,
            attribute: attr,
            value: attributes[attr],
          })
        ),
      };

      scoutingStore = scoutingStore.map((target) => {
        if (target.id === targetId) {
          const updatedReports = [newReport, ...(target.reports || [])];
          return {
            ...target,
            latestRating: calculatedOverall,
            reports: updatedReports,
          };
        }
        return target;
      });

      return newReport;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["scouting"] });
      queryClient.invalidateQueries({
        queryKey: ["scoutingTarget", variables.targetId],
      });
    },
  });
}

/** PATCH /scouting/:targetId/status */
export function useUpdateScoutingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      targetId,
      status,
    }: {
      targetId: string;
      status: ScoutingStatus;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      scoutingStore = scoutingStore.map((target) =>
        target.id === targetId ? { ...target, status } : target
      );
      return targetId;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["scouting"] });
      queryClient.invalidateQueries({
        queryKey: ["scoutingTarget", variables.targetId],
      });
    },
  });
}

/** POST /scouting/:targetId/open-transfer */
export function useOpenTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      scoutingStore = scoutingStore.map((target) =>
        target.id === targetId ? { ...target, status: "TRANSFER_OPENED" } : target
      );
      return targetId;
    },
    onSuccess: (_, targetId) => {
      queryClient.invalidateQueries({ queryKey: ["scouting"] });
      queryClient.invalidateQueries({
        queryKey: ["scoutingTarget", targetId],
      });
    },
  });
}

export function dropScoutingTarget(targetId: string) {
  scoutingStore = scoutingStore.map((target) =>
    target.id === targetId ? { ...target, status: "DROPPED" as const } : target
  );
}

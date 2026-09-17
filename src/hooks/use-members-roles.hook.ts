import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MOCK_MEMBERS,
  MOCK_ROLES,
  MOCK_PERMISSIONS,
  MOCK_ACTIVITY_LOGS,
} from "@/mocks/members-roles.mock";
import type {
  Member,
  Role,
  MemberStatus,
  Department,
  PermissionDefinition,
  ActivityLog,
} from "@/types/members-roles.types";

// In-memory mock databases so mutations persist across navigation in session
let membersStore: Member[] = [...MOCK_MEMBERS];
let rolesStore: Role[] = [...MOCK_ROLES];
let activityLogsStore: Record<string, ActivityLog[]> = { ...MOCK_ACTIVITY_LOGS };

/** Recalculate memberCount for each role based on membersStore */
export function syncMemberCounts() {
  rolesStore = rolesStore.map((role) => {
    const count = membersStore.filter((m) => m.roleId === role.id).length;
    return { ...role, memberCount: count };
  });
}

export function addMemberToStore(member: Member) {
  membersStore.unshift(member);
  syncMemberCounts();
}

export function setMemberStatusInStore(memberId: string, status: MemberStatus) {
  membersStore = membersStore.map((m) =>
    m.id === memberId ? { ...m, status } : m
  );
  syncMemberCounts();
}

export function getMemberFromStore(memberId: string): Member | undefined {
  return membersStore.find((m) => m.id === memberId);
}

export function getMembersStore(): Member[] {
  return [...membersStore];
}

// Fetchers
async function fetchMembers(): Promise<Member[]> {
  syncMemberCounts();
  return [...membersStore];
}

async function fetchRoles(): Promise<Role[]> {
  syncMemberCounts();
  return [...rolesStore];
}

// Query Hooks
export function useMembers() {
  return useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });
}

export function useRoles() {
  return useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });
}

export function usePermissions(): PermissionDefinition[] {
  return MOCK_PERMISSIONS;
}

export function useActivityLogs(entityId?: string): ActivityLog[] {
  if (!entityId) return [];
  return activityLogsStore[entityId] || [
    {
      id: `act-default-${entityId}`,
      timestamp: "Just now",
      action: "Entity Initialized",
      performedBy: "System Administrator",
      details: "Standard access rights and history initialized.",
    },
  ];
}

// Mutation Hooks

/** PATCH /memberships/:id/status { status: "ACTIVE" | "SUSPENDED" } */
export function useUpdateMemberStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      status,
    }: {
      memberId: string;
      status: MemberStatus;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      membersStore = membersStore.map((m) =>
        m.id === memberId ? { ...m, status } : m
      );

      // Add activity log
      const logs = activityLogsStore[memberId] || [];
      activityLogsStore[memberId] = [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          action: `Status Changed to ${status}`,
          performedBy: "Current User",
          details: `Account status updated to ${status}.`,
        },
        ...logs,
      ];

      return membersStore.find((m) => m.id === memberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

/** PATCH /memberships/:id { roleId: string } */
export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      roleId,
    }: {
      memberId: string;
      roleId: string;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const targetRole = rolesStore.find((r) => r.id === roleId);
      if (!targetRole) throw new Error("Role not found");

      membersStore = membersStore.map((m) =>
        m.id === memberId
          ? {
              ...m,
              roleId: targetRole.id,
              role: targetRole.name,
              department:
                targetRole.department !== "General"
                  ? (targetRole.department as Department)
                  : m.department,
            }
          : m
      );
      syncMemberCounts();

      // Add activity log
      const logs = activityLogsStore[memberId] || [];
      activityLogsStore[memberId] = [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          action: "Role Reassigned",
          performedBy: "Current User",
          details: `Reassigned to role "${targetRole.name}".`,
        },
        ...logs,
      ];

      return membersStore.find((m) => m.id === memberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

/** PATCH /memberships/:id/permissions { directPermissions, revokedPermissions } */
export function useUpdateMemberDirectPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      directPermissions,
      revokedPermissions,
    }: {
      memberId: string;
      directPermissions: string[];
      revokedPermissions: string[];
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      membersStore = membersStore.map((m) =>
        m.id === memberId
          ? { ...m, directPermissions, revokedPermissions }
          : m
      );

      // Add activity log
      const logs = activityLogsStore[memberId] || [];
      activityLogsStore[memberId] = [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          action: "Granular Permissions Modified",
          performedBy: "Current User",
          details: `Updated direct overrides: ${directPermissions.length} granted, ${revokedPermissions.length} revoked.`,
        },
        ...logs,
      ];

      return membersStore.find((m) => m.id === memberId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

/** DELETE /memberships/:id */
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      membersStore = membersStore.filter((m) => m.id !== memberId);
      syncMemberCounts();
      return memberId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

/** POST /clubs/:clubId/roles { name, description, department } */
export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      department = "General",
    }: {
      name: string;
      description?: string;
      department?: Department | "General";
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const newRole: Role = {
        id: `role-${Date.now()}`,
        name,
        description: description || "Custom club role.",
        department,
        isSystem: false,
        memberCount: 0,
        permissions: ["members.view"], // default baseline view access
      };
      rolesStore.push(newRole);
      return newRole;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

/** PATCH /roles/:id/permissions { grant: [...], revoke: [...] } */
export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roleId,
      permissions,
    }: {
      roleId: string;
      permissions: string[];
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      rolesStore = rolesStore.map((r) =>
        r.id === roleId ? { ...r, permissions } : r
      );

      // Add activity log
      const logs = activityLogsStore[roleId] || [];
      activityLogsStore[roleId] = [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          action: "Role Permissions Updated",
          performedBy: "Current User",
          details: `Updated role permission matrix (${permissions.length} total active permissions).`,
        },
        ...logs,
      ];

      return rolesStore.find((r) => r.id === roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

/** DELETE /roles/:id */
export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const targetRole = rolesStore.find((r) => r.id === roleId);
      if (targetRole?.isSystem) {
        throw new Error("Cannot delete a system role.");
      }
      rolesStore = rolesStore.filter((r) => r.id !== roleId);
      return roleId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

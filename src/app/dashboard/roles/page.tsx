"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  Plus,
  Search,
  Users,
  ShieldCheck,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import {
  useRoles,
  useCreateRole,
  useUpdateRolePermissions,
  useDeleteRole,
  usePermissions,
} from "@/hooks/use-members-roles.hook";
import { RoleDetailDrawer } from "@/features/members-roles/components/role-detail.drawer";
import { CreateRoleModal } from "@/features/members-roles/components/create-role.modal";
import { ConfirmDialog } from "@/features/members-roles/components/confirm-dialog";
import type { Role, Department } from "@/types/members-roles.types";

function RolesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleIdParam = searchParams.get("roleId");
  const createRoleParam = searchParams.get("createRole");
  const deleteRoleParam = searchParams.get("deleteRole");

  const { data: roles = [], isLoading } = useRoles();
  const allPermissions = usePermissions();

  const createRoleMutation = useCreateRole();
  const updatePermissionsMutation = useUpdateRolePermissions();
  const deleteRoleMutation = useDeleteRole();

  // Search filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Drawers
  const [selectedRoleForDetail, setSelectedRoleForDetail] =
    useState<Role | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedRoleForDelete, setSelectedRoleForDelete] =
    useState<Role | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Sync role drawer & modals with query params on load or URL change
  useEffect(() => {
    if (createRoleParam === "active" || createRoleParam === "true") {
      setIsCreateModalOpen(true);
    } else {
      setIsCreateModalOpen(false);
    }

    if (roleIdParam && roles.length > 0) {
      const targetRole = roles.find((r) => r.id === roleIdParam);
      if (targetRole) {
        setSelectedRoleForDetail(targetRole);

        if (deleteRoleParam === "active" || deleteRoleParam === "true") {
          setSelectedRoleForDelete(targetRole);
          setIsDeleteConfirmOpen(true);
        } else {
          setIsDeleteConfirmOpen(false);
        }

        setIsDetailDrawerOpen(true);
      }
    } else {
      setIsDetailDrawerOpen(false);
      setIsDeleteConfirmOpen(false);
    }
  }, [roleIdParam, createRoleParam, deleteRoleParam, roles]);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalRoles = roles.length;
  const systemRoles = roles.filter((r) => r.isSystem).length;
  const customRoles = roles.filter((r) => !r.isSystem).length;
  const totalAssignments = roles.reduce((acc, r) => acc + r.memberCount, 0);

  // Handlers with URL Syncing
  const handleOpenDetail = (role: Role) => {
    setSelectedRoleForDetail(role);
    setIsDetailDrawerOpen(true);
    router.push(`/dashboard/roles?roleId=${role.id}`);
  };

  const handleCloseDetail = () => {
    setIsDetailDrawerOpen(false);
    router.push("/dashboard/roles");
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    router.push("/dashboard/roles?createRole=active");
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    router.push("/dashboard/roles");
  };

  const handleCreateRole = (
    name: string,
    description: string,
    department: Department | "General"
  ) => {
    createRoleMutation.mutate(
      { name, description, department },
      {
        onSuccess: () => {
          handleCloseCreateModal();
        },
      }
    );
  };

  const handleSavePermissions = (roleId: string, permissions: string[]) => {
    updatePermissionsMutation.mutate(
      { roleId, permissions },
      {
        onSuccess: () => {
          handleCloseDetail();
        },
      }
    );
  };

  const handleOpenDeleteConfirm = (roleId: string) => {
    const roleToDelete = roles.find((r) => r.id === roleId);
    if (roleToDelete) {
      setSelectedRoleForDelete(roleToDelete);
      setIsDeleteConfirmOpen(true);
      router.push(`/dashboard/roles?roleId=${roleId}&deleteRole=active`);
    }
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    if (selectedRoleForDetail) {
      router.push(`/dashboard/roles?roleId=${selectedRoleForDetail.id}`);
    } else {
      router.push("/dashboard/roles");
    }
  };

  const handleConfirmDeleteRole = () => {
    if (!selectedRoleForDelete) return;
    deleteRoleMutation.mutate(selectedRoleForDelete.id, {
      onSuccess: () => {
        setIsDeleteConfirmOpen(false);
        handleCloseDetail();
      },
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Roles & Permissions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage organizational roles, access controls, and permission policies.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          New Role
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Total Roles
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totalRoles}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Active access roles
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            System Roles
          </p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {systemRoles}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Default platform roles
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Custom Roles
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {customRoles}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Club-specific roles
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Staff Assignments
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {totalAssignments}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Assigned to staff members
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs text-card-foreground">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles by title, department, description..."
            className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoles.map((role) => {
          const grantedCount = role.permissions?.length || 0;
          return (
            <div
              key={role.id}
              onClick={() => handleOpenDetail(role)}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition-all cursor-pointer text-card-foreground"
            >
              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                      <Shield className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                        {role.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="rounded-md bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
                          {role.department}
                        </span>
                        {role.isSystem && (
                          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
                            System
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1 shrink-0">
                    <Users className="h-3 w-3" />
                    {role.memberCount}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {role.description}
                </p>

                {/* Permissions summary badge list */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">
                      Access Granted
                    </span>
                    <span>
                      {grantedCount} / {allPermissions.length} permissions
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {allPermissions
                      .filter((p) => role.permissions?.includes(p.id))
                      .slice(0, 3)
                      .map((p) => (
                        <span
                          key={p.id}
                          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground"
                        >
                          <CheckCircle2 className="h-2.5 w-2.5 text-primary shrink-0" />
                          {p.name}
                        </span>
                      ))}
                    {grantedCount > 3 && (
                      <span className="inline-flex items-center rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        +{grantedCount - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-medium text-primary group-hover:underline">
                <span className="flex items-center gap-1">
                  <Sliders className="h-3.5 w-3.5" />
                  Edit Permissions
                </span>
                <span>→</span>
              </div>
            </div>
          );
        })}

        {filteredRoles.length === 0 && !isLoading && (
          <div className="col-span-full py-16 text-center text-xs text-muted-foreground">
            No matching roles found.
          </div>
        )}
      </div>

      {/* Role Detail Drawer */}
      <RoleDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={handleCloseDetail}
        role={selectedRoleForDetail}
        onSavePermissions={handleSavePermissions}
        onDeleteRole={handleOpenDeleteConfirm}
        isLoading={updatePermissionsMutation.isPending}
      />

      {/* Create Role Modal with ?createRole=active */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onCreateRole={handleCreateRole}
        isLoading={createRoleMutation.isPending}
      />

      {/* Delete Role Confirmation Dialog with ?deleteRole=active */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title={`Delete Role "${selectedRoleForDelete?.name}"?`}
        description="Are you sure you want to delete this custom role? Staff members assigned to this role will need to be re-assigned."
        confirmText="Delete Role"
        isDestructive
        isLoading={deleteRoleMutation.isPending}
        onConfirm={handleConfirmDeleteRole}
        onCancel={handleCloseDeleteConfirm}
      />
    </div>
  );
}

export default function RolesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading roles...</div>}>
      <RolesContent />
    </Suspense>
  );
}

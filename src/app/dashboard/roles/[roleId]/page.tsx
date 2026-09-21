"use client";

import { useState, useEffect, Suspense, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Users,
  CheckCircle2,
  Save,
  Sliders,
  History,
  Trash2,
} from "lucide-react";
import {
  useRoles,
  useMembers,
  usePermissions,
  useUpdateRolePermissions,
  useDeleteRole,
  useActivityLogs,
} from "@/hooks/use-members-roles.hook";
import { ConfirmDialog } from "@/features/members-roles/components/confirm-dialog";
import type { PermissionCategory } from "@/types/members-roles.types";

interface RoleDetailPageProps {
  params: Promise<{ roleId: string }>;
}

function RoleDetailContent({ roleId }: { roleId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deleteRoleParam = searchParams.get("deleteRole");

  const { data: roles = [] } = useRoles();
  const { data: members = [] } = useMembers();
  const allPermissions = usePermissions();
  const activityLogs = useActivityLogs(roleId);

  const updatePermissionsMutation = useUpdateRolePermissions();
  const deleteRoleMutation = useDeleteRole();

  const role = roles.find((r) => r.id === roleId);

  const [activeTab, setActiveTab] = useState<"matrix" | "members" | "activity">("matrix");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Sync selected permissions when role loads
  useEffect(() => {
    if (role) {
      setSelectedPermissions(role.permissions || []);
    }
  }, [role]);

  // Sync deleteRole query param
  useEffect(() => {
    if (deleteRoleParam === "active" || deleteRoleParam === "true") {
      setIsDeleteConfirmOpen(true);
    } else {
      setIsDeleteConfirmOpen(false);
    }
  }, [deleteRoleParam]);

  if (!role) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-4">
        <Link
          href="/dashboard/roles"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Roles
        </Link>
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          <p className="text-sm font-semibold">Role not found.</p>
        </div>
      </div>
    );
  }

  const assignedMembers = members.filter((m) => m.roleId === role.id);

  const categories: PermissionCategory[] = [
    "Members & HR",
    "Technical & Squad",
    "Medical & Health",
    "Finance & Transfers",
    "Operations & Settings",
  ];

  const handleOpenDeleteConfirm = () => {
    setIsDeleteConfirmOpen(true);
    router.push(`/dashboard/roles/${role.id}?deleteRole=active`);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    router.push(`/dashboard/roles/${role.id}`);
  };

  const handleToggle = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      const next = prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId];
      setHasChanges(true);
      return next;
    });
  };

  const handleSelectCategoryAll = (category: PermissionCategory) => {
    const catPerms = allPermissions
      .filter((p) => p.category === category)
      .map((p) => p.id);
    const allSelected = catPerms.every((id) => selectedPermissions.includes(id));

    setSelectedPermissions((prev) => {
      let next: string[];
      if (allSelected) {
        next = prev.filter((id) => !catPerms.includes(id));
      } else {
        next = Array.from(new Set([...prev, ...catPerms]));
      }
      setHasChanges(true);
      return next;
    });
  };

  const handleSave = () => {
    updatePermissionsMutation.mutate(
      { roleId: role.id, permissions: selectedPermissions },
      {
        onSuccess: () => {
          setHasChanges(false);
        },
      }
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <div>
        <Link
          href="/dashboard/roles"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Roles Directory
        </Link>
      </div>

      {/* Role Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-card-foreground space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {role.name}
                </h1>
                {role.isSystem ? (
                  <span className="rounded-md bg-primary-subtle text-primary border border-primary/20 px-2.5 py-0.5 text-[10px] font-semibold">
                    System Role
                  </span>
                ) : (
                  <span className="rounded-md bg-secondary text-secondary-foreground px-2.5 py-0.5 text-[10px] font-semibold">
                    Custom Role
                  </span>
                )}
                <span className="rounded-md bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
                  {role.department}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {role.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!role.isSystem && (
              <button
                type="button"
                onClick={handleOpenDeleteConfirm}
                className="inline-flex items-center gap-1.5 rounded-xl border border-danger/20 bg-danger/10 px-3.5 py-2 text-xs font-semibold text-danger hover:bg-danger/20 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Delete Role
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || updatePermissionsMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {updatePermissionsMutation.isPending ? "Saving..." : "Save Matrix"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("matrix")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "matrix"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sliders className="h-4 w-4" />
          Permission Matrix ({selectedPermissions.length} Active)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("members")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "members"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Assigned Members ({assignedMembers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("activity")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "activity"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="h-4 w-4" />
          Audit Log
        </button>
      </div>

      {/* TAB CONTENT: Matrix */}
      {activeTab === "matrix" && (
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryPermissions = allPermissions.filter(
              (p) => p.category === category
            );
            const allCatSelected = categoryPermissions.every((p) =>
              selectedPermissions.includes(p.id)
            );

            return (
              <div
                key={category}
                className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    {category}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSelectCategoryAll(category)}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {allCatSelected ? "Deselect Category All" : "Select Category All"}
                  </button>
                </div>

                <div className="space-y-3">
                  {categoryPermissions.map((perm) => {
                    const isGranted = selectedPermissions.includes(perm.id);
                    return (
                      <div
                        key={perm.id}
                        onClick={() => handleToggle(perm.id)}
                        className="flex items-start justify-between gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer border border-transparent hover:border-border"
                      >
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                            {perm.name}
                            {isGranted && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {perm.description}
                          </p>
                        </div>

                        {/* Toggle Switch */}
                        <div
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isGranted ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                              isGranted ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB CONTENT: Assigned Members */}
      {activeTab === "members" && (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {assignedMembers.map((member) => (
                <tr key={member.id} className="hover:bg-muted/30">
                  <td className="py-3 px-4 font-semibold text-foreground">
                    {member.name}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {member.department}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        member.status === "Active"
                          ? "bg-primary-subtle text-primary border border-primary/20"
                          : "bg-warning/10 text-warning border border-warning/20"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/dashboard/members/${member.id}`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View Profile →
                    </Link>
                  </td>
                </tr>
              ))}
              {assignedMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-xs text-muted-foreground">
                    No staff members currently hold this role.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Activity */}
      {activeTab === "activity" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Role Change Log
          </h2>
          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {activityLogs.map((log) => (
              <div key={log.id} className="relative pl-8 space-y-1">
                <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-card" />
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground">
                    {log.action}
                  </p>
                  <span className="text-[11px] text-muted-foreground">
                    {log.timestamp}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{log.details}</p>
                <p className="text-[10px] text-muted-foreground/80">
                  By {log.performedBy}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog with ?deleteRole=active */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title={`Delete Role "${role.name}"?`}
        description="Are you sure you want to delete this custom role? Assigned staff members will need to be re-assigned to another role."
        confirmText="Delete Role"
        isDestructive
        isLoading={deleteRoleMutation.isPending}
        onConfirm={() => {
          deleteRoleMutation.mutate(role.id, {
            onSuccess: () => {
              router.push("/dashboard/roles");
            },
          });
        }}
        onCancel={handleCloseDeleteConfirm}
      />
    </div>
  );
}

export default function RoleDetailPage({ params }: RoleDetailPageProps) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading role definition...</div>}>
      <RoleDetailContent roleId={resolvedParams.roleId} />
    </Suspense>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  KeyRound,
  Search,
  CheckCircle2,
  XCircle,
  Users,
  Grid,
  ListFilter,
  UserCheck,
  Sliders,
} from "lucide-react";
import {
  usePermissions,
  useRoles,
  useMembers,
} from "@/hooks/use-members-roles.hook";
import { PermissionDetailDrawer } from "@/features/members-roles/components/permission-detail.drawer";
import type { PermissionDefinition, PermissionCategory } from "@/types/members-roles.types";

function PermissionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const permissionIdParam = searchParams.get("permissionId");

  const allPermissions = usePermissions();
  const { data: roles = [] } = useRoles();
  const { data: members = [] } = useMembers();

  const [activeTab, setActiveTab] = useState<"directory" | "matrix" | "overrides">("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PermissionCategory | "All">("All");

  // Drawer state
  const [selectedPermissionForDrawer, setSelectedPermissionForDrawer] =
    useState<PermissionDefinition | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync drawer with ?permissionId query param on load or URL change
  useEffect(() => {
    if (permissionIdParam) {
      const foundPerm = allPermissions.find((p) => p.id === permissionIdParam);
      if (foundPerm) {
        setSelectedPermissionForDrawer(foundPerm);
        setIsDrawerOpen(true);
      }
    } else {
      setIsDrawerOpen(false);
    }
  }, [permissionIdParam, allPermissions]);

  const categories: PermissionCategory[] = [
    "Members & HR",
    "Technical & Squad",
    "Medical & Health",
    "Finance & Transfers",
    "Operations & Settings",
  ];

  const filteredPermissions = allPermissions.filter((perm) => {
    const matchesSearch =
      perm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perm.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perm.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || perm.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const membersWithOverrides = members.filter(
    (m) =>
      (m.directPermissions && m.directPermissions.length > 0) ||
      (m.revokedPermissions && m.revokedPermissions.length > 0)
  );

  // Drawer handlers with URL param sync
  const handleOpenDrawer = (perm: PermissionDefinition) => {
    setSelectedPermissionForDrawer(perm);
    setIsDrawerOpen(true);
    router.push(`/dashboard/permissions?permissionId=${perm.id}`);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    router.push("/dashboard/permissions");
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <KeyRound className="h-6 w-6 text-primary" />
            Permissions Registry
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Centralized registry of system access rights, role matrices, and member permission overrides.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Total Permissions
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {allPermissions.length}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Defined platform keys
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Categories
          </p>
          <p className="mt-1 text-2xl font-bold text-primary">
            {categories.length}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Functional domains
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Configured Roles
          </p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {roles.length}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Role profiles mapped
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs text-card-foreground">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Member Overrides
          </p>
          <p className="mt-1 text-2xl font-bold text-warning">
            {membersWithOverrides.length}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Staff with custom grants
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("directory")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "directory"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListFilter className="h-4 w-4" />
          Permissions Directory
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("matrix")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "matrix"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Grid className="h-4 w-4" />
          Role Matrix Comparison
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("overrides")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "overrides"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Member Overrides ({membersWithOverrides.length})
        </button>
      </div>

      {/* TAB 1: DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs text-card-foreground">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search permission name or key ID..."
                className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground">
              <span className="text-muted-foreground">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value as PermissionCategory | "All")
                }
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Permission Name & Key</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Assigned Roles</th>
                  <th className="py-3 px-4">Access Count</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredPermissions.map((perm) => {
                  const rolesWithPerm = roles.filter((r) =>
                    r.permissions?.includes(perm.id)
                  );
                  const totalMembersWithAccess = members.filter((m) => {
                    const rolePerms = roles.find((r) => r.id === m.roleId)?.permissions || [];
                    const directPerms = m.directPermissions || [];
                    const revokedPerms = m.revokedPermissions || [];
                    return (
                      (rolePerms.includes(perm.id) || directPerms.includes(perm.id)) &&
                      !revokedPerms.includes(perm.id)
                    );
                  }).length;

                  return (
                    <tr key={perm.id} className="hover:bg-muted/30">
                      <td className="py-3 px-4 space-y-0.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(perm)}
                          className="font-bold text-foreground hover:text-primary hover:underline text-left cursor-pointer"
                        >
                          {perm.name}
                        </button>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {perm.id}
                        </p>
                        <p className="text-[11px] text-muted-foreground/90 leading-snug">
                          {perm.description}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                          {perm.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {rolesWithPerm.map((r) => (
                            <Link
                              key={r.id}
                              href={`/dashboard/roles/${r.id}`}
                              className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground hover:bg-primary-subtle hover:text-primary transition-colors"
                            >
                              {r.name}
                            </Link>
                          ))}
                          {rolesWithPerm.length === 0 && (
                            <span className="text-muted-foreground italic">None</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {totalMembersWithAccess} staff
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDrawer(perm)}
                            className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
                          >
                            Quick View
                          </button>
                          <Link
                            href={`/dashboard/permissions/${perm.id}`}
                            className="rounded-lg bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold hover:bg-primary/20 transition-colors"
                          >
                            Full Page →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROLE MATRIX COMPARISON */}
      {activeTab === "matrix" && (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
          <table className="w-full text-left border-collapse min-w-[43.75rem]">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 min-w-56">Permission</th>
                {roles.map((r) => (
                  <th key={r.id} className="py-3 px-3 text-center">
                    <Link
                      href={`/dashboard/roles/${r.id}`}
                      className="hover:text-primary hover:underline"
                    >
                      {r.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {allPermissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleOpenDrawer(perm)}
                      className="font-semibold text-foreground hover:text-primary text-left cursor-pointer"
                    >
                      {perm.name}
                    </button>
                    <p className="text-[10px] text-muted-foreground font-mono">{perm.id}</p>
                  </td>
                  {roles.map((r) => {
                    const hasPerm = r.permissions?.includes(perm.id);
                    return (
                      <td key={r.id} className="py-3 px-3 text-center">
                        {hasPerm ? (
                          <CheckCircle2 className="h-4 w-4 text-primary inline-block" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground/30 inline-block" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: MEMBER GRANULAR OVERRIDES */}
      {activeTab === "overrides" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Direct Member Override Assignments
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              These staff members have direct permission grants or revocations configured outside their standard role.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Base Role</th>
                  <th className="py-3 px-4">Direct Granular Grants</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {membersWithOverrides.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {member.name}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {member.role}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(member.directPermissions || []).map((permId) => {
                          const pDef = allPermissions.find((p) => p.id === permId);
                          return (
                            <button
                              key={permId}
                              type="button"
                              onClick={() => {
                                if (pDef) handleOpenDrawer(pDef);
                              }}
                              className="rounded-md bg-primary-subtle text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-semibold hover:underline cursor-pointer"
                            >
                              +{pDef?.name || permId}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/dashboard/memberships/${member.id}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Manage Overrides →
                      </Link>
                    </td>
                  </tr>
                ))}

                {membersWithOverrides.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-xs text-muted-foreground">
                      No members currently have direct permission overrides.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permission Detail Drawer with ?permissionId=... */}
      <PermissionDetailDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        permission={selectedPermissionForDrawer}
      />
    </div>
  );
}

export default function PermissionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading permissions...</div>}>
      <PermissionsContent />
    </Suspense>
  );
}

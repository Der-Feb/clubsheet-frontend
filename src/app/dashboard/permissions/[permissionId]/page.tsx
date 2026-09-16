"use client";

import { useState, useEffect, Suspense, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  KeyRound,
  Shield,
  Users,
  CheckCircle2,
  Building2,
} from "lucide-react";
import {
  usePermissions,
  useRoles,
  useMembers,
} from "@/hooks/use-members-roles.hook";

interface PermissionDetailPageProps {
  params: Promise<{ permissionId: string }>;
}

function PermissionDetailContent({ permissionId }: { permissionId: string }) {
  const allPermissions = usePermissions();
  const { data: roles = [] } = useRoles();
  const { data: members = [] } = useMembers();

  const [activeTab, setActiveTab] = useState<"roles" | "members">("roles");

  const permission = allPermissions.find((p) => p.id === permissionId);

  if (!permission) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-4">
        <Link
          href="/dashboard/permissions"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Permissions Registry
        </Link>
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          <p className="text-sm font-semibold">Permission key not found.</p>
        </div>
      </div>
    );
  }

  const grantingRoles = roles.filter((r) =>
    r.permissions?.includes(permission.id)
  );

  const authorizedMembers = members.filter((m) => {
    const rolePerms = roles.find((r) => r.id === m.roleId)?.permissions || [];
    const directPerms = m.directPermissions || [];
    const revokedPerms = m.revokedPermissions || [];
    return (
      (rolePerms.includes(permission.id) || directPerms.includes(permission.id)) &&
      !revokedPerms.includes(permission.id)
    );
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          href="/dashboard/permissions"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Permissions Registry
        </Link>
      </div>

      {/* Permission Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-card-foreground space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <KeyRound className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {permission.name}
                </h1>
                <span className="rounded-md bg-secondary text-secondary-foreground px-2.5 py-0.5 text-[10px] font-semibold">
                  {permission.category}
                </span>
              </div>
              <p className="text-xs font-mono text-primary font-semibold mt-1">
                {permission.id}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border">
          {permission.description}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("roles")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "roles"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shield className="h-4 w-4" />
          Granting Roles ({grantingRoles.length})
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
          Authorized Staff Members ({authorizedMembers.length})
        </button>
      </div>

      {/* TAB 1: Granting Roles */}
      {activeTab === "roles" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {grantingRoles.map((role) => (
            <div
              key={role.id}
              className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">
                    {role.name}
                  </span>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {role.department}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {role.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {role.memberCount} members
                </span>
                <Link
                  href={`/dashboard/roles/${role.id}`}
                  className="font-semibold text-primary hover:underline"
                >
                  Manage Role →
                </Link>
              </div>
            </div>
          ))}

          {grantingRoles.length === 0 && (
            <div className="col-span-full py-12 text-center text-xs text-muted-foreground">
              No default roles grant this permission.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Authorized Staff Members */}
      {activeTab === "members" && (
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Access Type</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {authorizedMembers.map((member) => {
                const rolePerms = roles.find((r) => r.id === member.roleId)?.permissions || [];
                const isDirectOverride = (member.directPermissions || []).includes(permission.id) && !rolePerms.includes(permission.id);

                return (
                  <tr key={member.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {member.name}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {member.role}
                    </td>
                    <td className="py-3 px-4">
                      {isDirectOverride ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-primary-subtle text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-semibold">
                          <CheckCircle2 className="h-3 w-3" /> Direct Override
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-secondary/80 text-secondary-foreground px-2 py-0.5 text-[10px] font-medium">
                          Role Inheritance
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/dashboard/memberships/${member.id}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View Membership →
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {authorizedMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-xs text-muted-foreground">
                    No staff members currently possess this permission.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function PermissionDetailPage({ params }: PermissionDetailPageProps) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading permission details...</div>}>
      <PermissionDetailContent permissionId={resolvedParams.permissionId} />
    </Suspense>
  );
}

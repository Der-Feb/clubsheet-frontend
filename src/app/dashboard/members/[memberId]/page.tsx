"use client";

import { useState, useEffect, Suspense, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  Shield,
  UserCheck,
  UserX,
  KeyRound,
  History,
  CheckCircle2,
  XCircle,
  Save,
  Activity,
} from "lucide-react";
import {
  useMembers,
  useRoles,
  usePermissions,
  useUpdateMemberStatus,
  useUpdateMemberRole,
  useUpdateMemberDirectPermissions,
  useActivityLogs,
} from "@/hooks/use-members-roles.hook";
import { RolePickerModal } from "@/features/members-roles/components/role-picker.modal";
import { MedicalHistoryTable } from "@/features/members-roles/components/medical-history.table";
import type { PermissionCategory } from "@/types/members-roles.types";

interface MemberDetailPageProps {
  params: Promise<{ memberId: string }>;
}

function MemberDetailContent({ memberId }: { memberId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const changeRoleParam = searchParams.get("changeRole");

  const { data: members = [] } = useMembers();
  const { data: roles = [] } = useRoles();
  const allPermissions = usePermissions();
  const activityLogs = useActivityLogs(memberId);

  const updateStatusMutation = useUpdateMemberStatus();
  const updateRoleMutation = useUpdateMemberRole();
  const updateDirectPermsMutation = useUpdateMemberDirectPermissions();

  const member = members.find((m) => m.id === memberId);

  const [activeTab, setActiveTab] = useState<"overview" | "permissions" | "medical" | "activity">("overview");

  // Granular Direct Permissions state
  const [directPermissions, setDirectPermissions] = useState<string[]>([]);
  const [revokedPermissions, setRevokedPermissions] = useState<string[]>([]);
  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);
  const [hasPermChanges, setHasPermChanges] = useState(false);

  // Sync direct permissions when member loads
  useEffect(() => {
    if (member) {
      setDirectPermissions(member.directPermissions || []);
      setRevokedPermissions(member.revokedPermissions || []);
    }
  }, [member]);

  // Sync changeRole query param
  useEffect(() => {
    if (changeRoleParam === "active" || changeRoleParam === "true") {
      setIsRolePickerOpen(true);
    } else {
      setIsRolePickerOpen(false);
    }
  }, [changeRoleParam]);

  if (!member) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-4">
        <Link
          href="/dashboard/members"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Members
        </Link>
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          <p className="text-sm font-semibold">Member not found.</p>
        </div>
      </div>
    );
  }

  const currentRole = roles.find((r) => r.id === member.roleId);
  const rolePermissionIds = currentRole?.permissions || [];

  // Effective permissions calculation
  const effectivePermissionIds = Array.from(
    new Set([...rolePermissionIds, ...directPermissions])
  ).filter((id) => !revokedPermissions.includes(id));

  const isSuspended = member.status === "Suspended";

  const handleOpenRolePicker = () => {
    setIsRolePickerOpen(true);
    router.push(`/dashboard/members/${member.id}?changeRole=active`);
  };

  const handleCloseRolePicker = () => {
    setIsRolePickerOpen(false);
    router.push(`/dashboard/members/${member.id}`);
  };

  const handleToggleDirectGrant = (permId: string) => {
    setDirectPermissions((prev) => {
      const next = prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId];
      setHasPermChanges(true);
      return next;
    });
  };

  const handleSaveDirectPermissions = () => {
    updateDirectPermsMutation.mutate(
      {
        memberId: member.id,
        directPermissions,
        revokedPermissions,
      },
      {
        onSuccess: () => {
          setHasPermChanges(false);
        },
      }
    );
  };

  const handleToggleStatus = () => {
    const newStatus = isSuspended ? "Active" : "Suspended";
    updateStatusMutation.mutate({ memberId: member.id, status: newStatus });
  };

  const categories: PermissionCategory[] = [
    "Members & HR",
    "Technical & Squad",
    "Medical & Health",
    "Finance & Transfers",
    "Operations & Settings",
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <div>
        <Link
          href="/dashboard/members"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Members Directory
        </Link>
      </div>

      {/* Member Header Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-card-foreground space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-xl font-bold text-primary">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  {member.name}
                </h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                    member.status === "Active"
                      ? "bg-primary-subtle text-primary border border-primary/20"
                      : member.status === "Invited"
                      ? "bg-warning/10 text-warning border border-warning/20"
                      : "bg-danger/10 text-danger border border-danger/20"
                  }`}
                >
                  {member.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {member.role} • {member.department} Department
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleStatus}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                isSuspended
                  ? "bg-success/10 text-success border border-success/20 hover:bg-success/20"
                  : "bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20"
              }`}
            >
              {isSuspended ? (
                <>
                  <UserCheck className="h-4 w-4" /> Reactivate Account
                </>
              ) : (
                <>
                  <UserX className="h-4 w-4" /> Suspend Account
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleOpenRolePicker}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              <Shield className="h-4 w-4 text-primary" />
              Change Role
            </button>
          </div>
        </div>

        {/* Quick Meta Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{member.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{member.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Joined Club: {member.joinedDate}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex items-center gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" />
          Overview & Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("permissions")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "permissions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <KeyRound className="h-4 w-4" />
          Granular Permissions
          {directPermissions.length > 0 && (
            <span className="ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
              +{directPermissions.length}
            </span>
          )}
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
          Activity & History
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("medical")}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "medical"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Activity className="h-4 w-4" />
          Medical History
        </button>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Assigned Role & Responsibilities
              </h2>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-bold text-base text-foreground">
                    {member.role}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {currentRole?.description}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <Link
                  href={`/dashboard/roles/${member.roleId}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  View Role Definition & Matrix →
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Active Access Scope ({effectivePermissionIds.length} Granted)
              </h2>
              <div className="flex flex-wrap gap-2">
                {allPermissions
                  .filter((p) => effectivePermissionIds.includes(p.id))
                  .map((perm) => (
                    <span
                      key={perm.id}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-muted px-3 py-1.5 text-xs font-medium text-foreground border border-border"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      {perm.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Department
              </h2>
              <p className="text-sm font-semibold text-foreground">
                {member.department}
              </p>
              <p className="text-xs text-muted-foreground">
                All staff permissions inherit default {member.department}{" "}
                policies.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Granular Permissions Overrides */}
      {activeTab === "permissions" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Individual Permission Overrides for {member.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Grant custom permissions or revoke specific access rights directly on this member, independent of their role.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveDirectPermissions}
              disabled={!hasPermChanges || updateDirectPermsMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {updateDirectPermsMutation.isPending ? "Saving..." : "Save Overrides"}
            </button>
          </div>

          <div className="space-y-4">
            {categories.map((category) => {
              const categoryPermissions = allPermissions.filter(
                (p) => p.category === category
              );

              return (
                <div
                  key={category}
                  className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs"
                >
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">
                    {category}
                  </h3>

                  <div className="divide-y divide-border">
                    {categoryPermissions.map((perm) => {
                      const isGrantedByRole = rolePermissionIds.includes(perm.id);
                      const isDirectlyGranted = directPermissions.includes(perm.id);
                      const isRevoked = revokedPermissions.includes(perm.id);
                      const isEffective = (isGrantedByRole || isDirectlyGranted) && !isRevoked;

                      return (
                        <div
                          key={perm.id}
                          className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-semibold text-foreground">
                                {perm.name}
                              </p>
                              {isEffective ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-primary-subtle text-primary px-2 py-0.5 text-[10px] font-semibold border border-primary/20">
                                  <CheckCircle2 className="h-3 w-3" /> Effective Access
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-md bg-muted text-muted-foreground px-2 py-0.5 text-[10px] font-medium border border-border">
                                  <XCircle className="h-3 w-3" /> No Access
                                </span>
                              )}
                              {isGrantedByRole && (
                                <span className="rounded-md bg-secondary/80 px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
                                  From Role
                                </span>
                              )}
                              {isDirectlyGranted && (
                                <span className="rounded-md bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-bold">
                                  Direct Grant Override
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              {perm.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleDirectGrant(perm.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                                isDirectlyGranted
                                  ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                                  : "border border-border bg-card text-foreground hover:bg-muted"
                              }`}
                            >
                              {isDirectlyGranted ? "Directly Granted" : "Grant Override"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "medical" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Medical History
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Historical health records are separate from transfer medical examinations.
            </p>
          </div>
          <MedicalHistoryTable membershipId={member.id} />
        </div>
      )}

      {/* TAB CONTENT: Activity & Audit Log */}
      {activeTab === "activity" && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Audit Activity Trail
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

      {/* Role Picker Modal with ?changeRole=active */}
      <RolePickerModal
        isOpen={isRolePickerOpen}
        onClose={handleCloseRolePicker}
        member={member}
        onSelectRole={(roleId) => {
          updateRoleMutation.mutate(
            { memberId: member.id, roleId },
            {
              onSuccess: () => {
                handleCloseRolePicker();
              },
            }
          );
        }}
        isLoading={updateRoleMutation.isPending}
      />
    </div>
  );
}

export default function MemberDetailPage({ params }: MemberDetailPageProps) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="p-8 text-xs text-muted-foreground">Loading member profile...</div>}>
      <MemberDetailContent memberId={resolvedParams.memberId} />
    </Suspense>
  );
}

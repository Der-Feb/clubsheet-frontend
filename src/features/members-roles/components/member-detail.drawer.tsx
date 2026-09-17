"use client";

import { useEffect } from "react";
import {
  X,
  Mail,
  Phone,
  Calendar,
  Building2,
  Shield,
  UserCheck,
  UserX,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { useRoles, usePermissions } from "@/hooks/use-members-roles.hook";
import type { Member } from "@/types/members-roles.types";
import Link from "next/link";

interface MemberDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onChangeRoleClick: () => void;
  onToggleStatus: () => void;
  onManageRoleClick?: (roleId: string) => void;
}

export function MemberDetailDrawer({
  isOpen,
  onClose,
  member,
  onChangeRoleClick,
  onToggleStatus,
  onManageRoleClick,
}: MemberDetailDrawerProps) {
  const { data: roles = [] } = useRoles();
  const allPermissions = usePermissions();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  const currentRole = roles.find((r) => r.id === member.roleId);
  const rolePermissionIds = currentRole?.permissions || [];
  const directPermissionIds = member.directPermissions || [];
  const revokedPermissionIds = member.revokedPermissions || [];

  // Effective permissions calculation
  const effectivePermissionIds = Array.from(
    new Set([...rolePermissionIds, ...directPermissionIds])
  ).filter((id) => !revokedPermissionIds.includes(id));

  const grantedPermissions = allPermissions.filter((p) =>
    effectivePermissionIds.includes(p.id)
  );

  const directGrantedPerms = allPermissions.filter((p) =>
    directPermissionIds.includes(p.id)
  );

  const isSuspended = member.status === "Suspended";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl text-card-foreground animate-in slide-in-from-right duration-250 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-base font-bold text-primary">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {member.name}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      member.status === "Active"
                        ? "bg-primary-subtle text-primary border border-primary/20"
                        : member.status === "Invited"
                        ? "bg-warning/10 text-warning border border-warning/20"
                        : "bg-danger/10 text-danger border border-danger/20"
                    }`}
                  >
                    {member.status}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined {member.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Contact Information */}
            <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Contact Details
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-foreground">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-foreground">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-foreground">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Department: {member.department}</span>
                </div>
              </div>
            </div>

            {/* Current Role Section */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  Current Role
                </h3>
                <button
                  type="button"
                  onClick={onChangeRoleClick}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
                >
                  Change Role
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">
                  {member.role}
                </span>
                {currentRole?.isSystem && (
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
                    System Role
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentRole?.description || "Assigned organizational role."}
              </p>
            </div>

            {/* Status & Account Actions */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Account Status
              </h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-foreground">
                    Membership Access: {member.status}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {isSuspended
                      ? "User cannot log in or access club resources."
                      : "User has active access to authorized modules."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onToggleStatus}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                    isSuspended
                      ? "bg-success/10 text-success border border-success/20 hover:bg-success/20"
                      : "bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20"
                  }`}
                >
                  {isSuspended ? (
                    <>
                      <UserCheck className="h-3.5 w-3.5" />
                      Reactivate
                    </>
                  ) : (
                    <>
                      <UserX className="h-3.5 w-3.5" />
                      Suspend
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Role Permissions Summary */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Effective Permissions ({grantedPermissions.length})
                </h3>
                {onManageRoleClick ? (
                  <button
                    type="button"
                    onClick={() => onManageRoleClick(member.roleId)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
                  >
                    <span>Role details</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                ) : (
                  <Link
                    href={`/dashboard/roles?roleId=${member.roleId}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
                  >
                    <span>Role details</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {directGrantedPerms.length > 0 && (
                <div className="rounded-xl bg-primary-subtle border border-primary/20 p-2.5 space-y-1">
                  <p className="text-[11px] font-semibold text-primary flex items-center gap-1">
                    <KeyRound className="h-3 w-3" />
                    Direct Granular Overrides ({directGrantedPerms.length})
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    This member has explicit permission overrides beyond their role.
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pt-1">
                {grantedPermissions.map((perm) => (
                  <span
                    key={perm.id}
                    className="inline-flex items-center gap-1 rounded-lg bg-muted px-2 py-1 text-[11px] font-medium text-foreground border border-border"
                  >
                    <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                    {perm.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer with Full Page Link */}
          <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Close
            </button>

            <Link
              href={`/dashboard/members/${member.id}`}
              replace
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              <span>View Full Member Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

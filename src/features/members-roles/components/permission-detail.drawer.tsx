"use client";

import { useEffect } from "react";
import {
  X,
  KeyRound,
  Shield,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useRoles, useMembers } from "@/hooks/use-members-roles.hook";
import type { PermissionDefinition } from "@/types/members-roles.types";
import Link from "next/link";

interface PermissionDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  permission: PermissionDefinition | null;
}

export function PermissionDetailDrawer({
  isOpen,
  onClose,
  permission,
}: PermissionDetailDrawerProps) {
  const { data: roles = [] } = useRoles();
  const { data: members = [] } = useMembers();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !permission) return null;

  // Roles that grant this permission
  const grantingRoles = roles.filter((r) =>
    r.permissions?.includes(permission.id)
  );

  // Members with effective access to this permission
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
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <KeyRound className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {permission.name}
                </h2>
                <span className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                  {permission.category}
                </span>
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
            {/* Permission Key & Description */}
            <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                System Identifier
              </h3>
              <p className="text-xs font-mono text-primary font-semibold">
                {permission.id}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                {permission.description}
              </p>
            </div>

            {/* Granting Roles */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Granting Roles ({grantingRoles.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {grantingRoles.map((r) => (
                  <Link
                    key={r.id}
                    href={`/dashboard/roles/${r.id}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground hover:bg-primary-subtle hover:text-primary transition-colors border border-border"
                  >
                    <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                    {r.name}
                  </Link>
                ))}
                {grantingRoles.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">
                    No roles currently grant this permission by default.
                  </span>
                )}
              </div>
            </div>

            {/* Authorized Staff Members */}
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                Authorized Staff Members ({authorizedMembers.length})
              </h3>
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {authorizedMembers.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2 rounded-xl border border-border bg-muted/20 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{m.name}</p>
                      <p className="text-[10px] text-muted-foreground">{m.role}</p>
                    </div>
                    <Link
                      href={`/dashboard/memberships/${m.id}`}
                      onClick={onClose}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      Profile →
                    </Link>
                  </div>
                ))}
                {authorizedMembers.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">
                    No staff members currently hold this permission.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Drawer Footer with Link to Full Permission Page */}
          <div className="p-4 border-t border-border bg-card flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Close
            </button>

            <Link
              href={`/dashboard/permissions/${permission.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              <span>View Full Permission Page</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

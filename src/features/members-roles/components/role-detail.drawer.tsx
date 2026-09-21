"use client";

import { useState, useEffect } from "react";
import {
  X,
  Shield,
  Users,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Save,
  ArrowRight,
} from "lucide-react";
import { usePermissions } from "@/hooks/use-members-roles.hook";
import type { Role, PermissionCategory } from "@/types/members-roles.types";
import Link from "next/link";

interface RoleDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSavePermissions: (roleId: string, permissions: string[]) => void;
  onDeleteRole?: (roleId: string) => void;
  isLoading?: boolean;
}

export function RoleDetailDrawer({
  isOpen,
  onClose,
  role,
  onSavePermissions,
  onDeleteRole,
  isLoading = false,
}: RoleDetailDrawerProps) {
  const allPermissions = usePermissions();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (role) {
      setSelectedPermissions(role.permissions || []);
      setHasChanges(false);
    }
  }, [role, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !role) return null;

  // Group permissions by category
  const categories: PermissionCategory[] = [
    "Members & HR",
    "Technical & Squad",
    "Medical & Health",
    "Finance & Transfers",
    "Operations & Settings",
  ];

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
    onSavePermissions(role.id, selectedPermissions);
    setHasChanges(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex w-full max-w-lg pl-4 sm:pl-10">
        {/* Drawer Panel */}
        <div className="w-full bg-card border-l border-border shadow-2xl text-card-foreground animate-in slide-in-from-right duration-250 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary shrink-0" />
                <h2 className="text-lg font-bold text-foreground">
                  {role.name}
                </h2>
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

            <div className="flex items-center gap-2">
              {role.isSystem ? (
                <span className="rounded-md bg-primary-subtle text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-semibold">
                  System Role
                </span>
              ) : (
                <span className="rounded-md bg-secondary text-secondary-foreground px-2 py-0.5 text-[10px] font-semibold">
                  Custom Role
                </span>
              )}
              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
                {role.department}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1 ml-auto">
                <Users className="h-3 w-3" />
                {role.memberCount} members
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {role.description}
            </p>
          </div>

          {/* Permissions Matrix Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Permission Matrix
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Toggle permissions granted to members holding this role.
                </p>
              </div>
              <span className="text-xs font-semibold text-primary">
                {selectedPermissions.length} / {allPermissions.length} Granted
              </span>
            </div>

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
                  className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between border-b border-border pb-2.5">
                    <h4 className="text-xs font-bold text-foreground">
                      {category}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleSelectCategoryAll(category)}
                      className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                    >
                      {allCatSelected ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="space-y-3 pt-1">
                    {categoryPermissions.map((perm) => {
                      const isGranted = selectedPermissions.includes(perm.id);
                      return (
                        <div
                          key={perm.id}
                          onClick={() => handleToggle(perm.id)}
                          className="flex items-start justify-between gap-3 p-2 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer"
                        >
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                              {perm.name}
                              {isGranted && (
                                <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                              )}
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-snug">
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

          {/* Drawer Footer */}
          <div className="flex flex-col items-stretch justify-between gap-3 border-t border-border bg-card p-4 sm:flex-row sm:items-center">
            {!role.isSystem && onDeleteRole ? (
              <button
                type="button"
                onClick={() => onDeleteRole(role.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-danger/20 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/20 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            ) : (
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                System role
              </span>
            )}

            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/roles/${role.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
              >
                <span>Full Page</span>
                <ArrowRight className="h-3 w-3" />
              </Link>

              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                {isLoading ? "Saving..." : "Save Matrix"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

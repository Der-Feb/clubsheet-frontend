"use client";

import { useState, useEffect } from "react";
import { Search, X, Check, Shield, Users } from "lucide-react";
import { useRoles } from "@/hooks/use-members-roles.hook";
import type { Member, Role } from "@/types/members-roles.types";

interface RolePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  onSelectRole: (roleId: string) => void;
  isLoading?: boolean;
}

export function RolePickerModal({
  isOpen,
  onClose,
  member,
  onSelectRole,
  isLoading = false,
}: RolePickerModalProps) {
  const { data: roles = [] } = useRoles();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  useEffect(() => {
    if (member) {
      setSelectedRoleId(member.roleId);
    }
    setSearchQuery("");
  }, [member, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (selectedRoleId) {
      onSelectRole(selectedRoleId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-picker-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2
              id="role-picker-title"
              className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2"
            >
              <Shield className="h-5 w-5 text-primary" />
              Change Role for {member.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select an organizational role to update access permissions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles by name or department..."
            className="h-9 w-full rounded-xl border border-border bg-muted/40 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Role List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-72">
          {filteredRoles.map((role: Role) => {
            const isSelected = selectedRoleId === role.id;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`group flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary-subtle text-foreground shadow-xs"
                    : "border-border bg-card hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-xs text-foreground">
                      {role.name}
                    </p>
                    {role.isSystem && (
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
                        System
                      </span>
                    )}
                    <span className="rounded-md bg-secondary/60 px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">
                      {role.department}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {role.description}
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                    <Users className="h-3 w-3" />
                    {role.memberCount}{" "}
                    {role.memberCount === 1 ? "member" : "members"} assigned
                  </p>
                </div>

                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted group-hover:border-primary/50"
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" />}
                </div>
              </div>
            );
          })}

          {filteredRoles.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching roles found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !selectedRoleId}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Assigning..." : "Assign Role"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { X, Plus, Shield } from "lucide-react";
import type { Department } from "@/types/members-roles.types";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRole: (
    name: string,
    description: string,
    department: Department | "General"
  ) => void;
  isLoading?: boolean;
}

export function CreateRoleModal({
  isOpen,
  onClose,
  onCreateRole,
  isLoading = false,
}: CreateRoleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState<Department | "General">("General");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setDepartment("General");
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Role name is required");
      return;
    }
    onCreateRole(name.trim(), description.trim(), department);
    onClose();
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
        aria-labelledby="create-role-title"
        className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 id="create-role-title" className="text-base font-bold text-foreground">
              Create New Role
            </h2>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Role Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Role Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g., Performance Analyst, Logistics Manager"
              className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {error && <p className="text-[11px] text-danger">{error}</p>}
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department | "General")}
              className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="General">General / Cross-functional</option>
              <option value="Technical">Technical</option>
              <option value="Management">Management</option>
              <option value="Medical">Medical</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe responsibilities and access scopes for this role..."
              className="w-full rounded-xl border border-border bg-muted/40 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              {isLoading ? "Creating..." : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

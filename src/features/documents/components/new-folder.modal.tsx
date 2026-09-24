"use client";

import { useState, useEffect } from "react";
import { X, FolderPlus, Lock } from "lucide-react";
import { ScrollArea } from "@/components/ScrollArea";

export interface NewFolderInput {
  name: string;
  department: string;
}

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folder: NewFolderInput) => void;
}

const DEPARTMENTS = [
  "All Club Members",
  "Policies & Governance",
  "Athlete Contracts",
  "Medical & Physio",
  "Technical Staff & Coaching",
  "Administration & Finance",
  "Academy Operations",
];

export function NewFolderModal({
  isOpen,
  onClose,
  onCreateFolder,
}: NewFolderModalProps) {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [error, setError] = useState("");

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
      setError("Folder name is required");
      return;
    }

    onCreateFolder({
      name: name.trim(),
      department,
    });

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
      <ScrollArea
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-folder-title"
        className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-primary" />
            <h2 id="new-folder-title" className="text-base font-bold text-foreground">
              Create Document Folder
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-xs text-danger font-medium">
              {error}
            </div>
          )}

          {/* Folder Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Folder Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Scouting & Recruitment 2026"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              required
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Department Access */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Access & Department Scope
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              Create Folder
            </button>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
}

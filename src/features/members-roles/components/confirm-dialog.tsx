"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog box */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              isDestructive
                ? "bg-danger/10 text-danger"
                : "bg-primary/10 text-primary"
            )}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <h3
              id="dialog-title"
              className="text-base font-semibold text-foreground"
            >
              {title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50",
              isDestructive
                ? "bg-danger hover:bg-danger/90"
                : "bg-primary hover:bg-primary-hover"
            )}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

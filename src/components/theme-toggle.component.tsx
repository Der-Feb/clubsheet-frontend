"use client";

import React from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/hooks/use-theme.hook";
import type { ThemeMode } from "@/types/theme.types";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "segmented" | "icon-button";
}

/**
 * Theme toggle component supporting light, dark, and system preference modes.
 */
export function ThemeToggle({
  className,
  variant = "segmented",
}: ThemeToggleProps) {
  const { mode, resolvedMode, setMode } = useTheme();

  if (variant === "icon-button") {
    const nextMode = resolvedMode === "dark" ? "light" : "dark";
    return (
      <button
        type="button"
        onClick={() => setMode(nextMode)}
        aria-label={`Switch to ${nextMode} mode`}
        title={`Current mode: ${mode} (${resolvedMode}). Click to switch.`}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer",
          className
        )}
      >
        {resolvedMode === "dark" ? (
          <Moon className="h-4 w-4 text-primary" />
        ) : (
          <Sun className="h-4 w-4 text-primary" />
        )}
      </button>
    );
  }

  const options: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
    { value: "system", label: "System", icon: <Laptop className="h-3.5 w-3.5" /> },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Color theme selection"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-xs",
        className
      )}
    >
      {options.map((opt) => {
        const isSelected = mode === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={isSelected}
            type="button"
            onClick={() => setMode(opt.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
              isSelected
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

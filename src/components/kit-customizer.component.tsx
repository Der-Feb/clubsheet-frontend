"use client";

import React, { useState } from "react";
import { Check, Palette, RotateCcw, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/use-theme.hook";
import { KIT_PRESETS, DEFAULT_CLUBSHEET_BRAND } from "@/config/theme.config";
import type { ClubBrand } from "@/types/theme.types";
import { normalizeBrandColors, analyzeColor } from "@/lib/brand-analyzer.utils";
import { ThemeToggle } from "./theme-toggle.component";
import { cn } from "@/lib/utils";

interface KitCustomizerProps {
  className?: string;
  onSave?: (brand: ClubBrand) => void;
}

export function KitCustomizer({ className, onSave }: KitCustomizerProps) {
  const { brand, setBrand, resolvedMode } = useTheme();

  // Local state for custom color inputs
  const [customPrimary, setCustomPrimary] = useState(brand.primary || DEFAULT_CLUBSHEET_BRAND.primary || "#005F31");
  const [customSecondary, setCustomSecondary] = useState(brand.secondary || DEFAULT_CLUBSHEET_BRAND.secondary || "#DFE3DA");
  const [customTertiary, setCustomTertiary] = useState(brand.tertiary || DEFAULT_CLUBSHEET_BRAND.tertiary || "#01562D");
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");

  // Normalized brand for preview
  const currentPreview = normalizeBrandColors({
    primary: customPrimary,
    secondary: customSecondary,
    tertiary: customTertiary,
  });

  const handleSelectPreset = (presetBrand: ClubBrand) => {
    setBrand(presetBrand);
    if (presetBrand.primary) setCustomPrimary(presetBrand.primary);
    if (presetBrand.secondary) setCustomSecondary(presetBrand.secondary);
    if (presetBrand.tertiary) setCustomTertiary(presetBrand.tertiary);
    onSave?.(presetBrand);
  };

  const handleApplyCustom = () => {
    const newBrand: ClubBrand = {
      primary: customPrimary,
      secondary: customSecondary,
      tertiary: customTertiary,
    };
    setBrand(newBrand);
    onSave?.(newBrand);
  };

  const handleReset = () => {
    handleSelectPreset(DEFAULT_CLUBSHEET_BRAND);
  };

  const primaryAnalysis = analyzeColor(customPrimary);

  return (
    <div className={cn("space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xs", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Club Kit & Appearance</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Customize your team&apos;s dynamic 1–3 kit colors or choose from iconic club palettes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleReset}
            title="Reset to ClubSheet default"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={cn(
            "rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
            activeTab === "presets"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          Iconic Kit Presets
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("custom")}
          className={cn(
            "rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer",
            activeTab === "custom"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          Custom Kit Colors (1–3 Colors)
        </button>
      </div>

      {/* Tab 1: Presets */}
      {activeTab === "presets" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {KIT_PRESETS.map((preset) => {
            const isSelected =
              brand.primary?.toLowerCase() === preset.brand.primary?.toLowerCase();
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.brand)}
                className={cn(
                  "flex flex-col items-start rounded-xl border p-3.5 text-left transition-all cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary-subtle ring-2 ring-primary/20 shadow-xs"
                    : "border-border bg-card hover:border-border hover:bg-muted/50"
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{preset.name}</span>
                  {isSelected && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{preset.description}</p>

                {/* Color swatches */}
                <div className="mt-3 flex items-center gap-1.5">
                  <div
                    className="h-5 w-5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: preset.brand.primary }}
                    title={`Primary: ${preset.brand.primary}`}
                  />
                  {preset.brand.secondary && (
                    <div
                      className="h-5 w-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: preset.brand.secondary }}
                      title={`Secondary: ${preset.brand.secondary}`}
                    />
                  )}
                  {preset.brand.tertiary && (
                    <div
                      className="h-5 w-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: preset.brand.tertiary }}
                      title={`Tertiary: ${preset.brand.tertiary}`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab 2: Custom Kit Colors */}
      {activeTab === "custom" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Primary Color */}
            <div className="space-y-1.5 rounded-xl border border-border p-3.5 bg-card">
              <label htmlFor="primary-color" className="block text-xs font-semibold text-foreground">
                Primary Kit Color (Required)
              </label>
              <p className="text-[11px] text-muted-foreground">Main shirt / dominant club identity.</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="primary-color-picker"
                  type="color"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  className="h-9 w-9 rounded-lg border border-border cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  id="primary-color"
                  type="text"
                  value={customPrimary}
                  onChange={(e) => setCustomPrimary(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="#005F31"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div className="space-y-1.5 rounded-xl border border-border p-3.5 bg-card">
              <label htmlFor="secondary-color" className="block text-xs font-semibold text-foreground">
                Secondary Color (Optional)
              </label>
              <p className="text-[11px] text-muted-foreground">Shorts, sleeves or collar trim.</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="secondary-color-picker"
                  type="color"
                  value={customSecondary}
                  onChange={(e) => setCustomSecondary(e.target.value)}
                  className="h-9 w-9 rounded-lg border border-border cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  id="secondary-color"
                  type="text"
                  value={customSecondary}
                  onChange={(e) => setCustomSecondary(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="#DFE3DA"
                />
              </div>
            </div>

            {/* Tertiary Color */}
            <div className="space-y-1.5 rounded-xl border border-border p-3.5 bg-card">
              <label htmlFor="tertiary-color" className="block text-xs font-semibold text-foreground">
                Tertiary / Cup Color (Optional)
              </label>
              <p className="text-[11px] text-muted-foreground">Third kit accent, numbers or gold trim.</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="tertiary-color-picker"
                  type="color"
                  value={customTertiary}
                  onChange={(e) => setCustomTertiary(e.target.value)}
                  className="h-9 w-9 rounded-lg border border-border cursor-pointer p-0.5 bg-transparent"
                />
                <input
                  id="tertiary-color"
                  type="text"
                  value={customTertiary}
                  onChange={(e) => setCustomTertiary(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="#01562D"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplyCustom}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            Apply Custom Kit Theme
          </button>
        </div>
      )}

      {/* Live Preview Panel */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live UI Component Preview ({resolvedMode} mode)
        </h3>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Action button preview */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-muted-foreground">Primary & Secondary Actions:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs"
              >
                Save Athlete
              </button>
              <button
                type="button"
                className="rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Badge & Highlight preview */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-muted-foreground">Badges & Highlights:</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-medium text-primary border border-primary/20">
                Active Match
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-tertiary px-2.5 py-0.5 text-xs font-medium text-tertiary-foreground">
                Cup Final
              </span>
            </div>
          </div>

          {/* Intelligence summary */}
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground">Color Science:</span>
            <p className="text-[11px] text-foreground">
              Hue: <span className="font-mono">{Math.round(primaryAnalysis.h)}°</span> | Chroma: <span className="font-mono">{primaryAnalysis.c.toFixed(2)}</span>
            </p>
            <p className="text-[10px] text-muted-foreground">
              Harmonic 3-kit palette: <span className="font-mono">{currentPreview.primary}</span>, <span className="font-mono">{currentPreview.secondary}</span>, <span className="font-mono">{currentPreview.tertiary}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

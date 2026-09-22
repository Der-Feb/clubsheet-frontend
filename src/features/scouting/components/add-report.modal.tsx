"use client";

import { useState, useEffect } from "react";
import { X, FilePlus, DollarSign } from "lucide-react";
import type { ScoutingAttribute } from "@/types/scouting.types";

interface AddScoutingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  defaultPosition?: string;
  onAddReport: (reportData: {
    position: string;
    estimatedValue: number;
    notes: string;
    attributes: Record<ScoutingAttribute, number>;
  }) => void;
  isLoading?: boolean;
}

export function AddScoutingReportModal({
  isOpen,
  onClose,
  targetName,
  defaultPosition = "Striker",
  onAddReport,
  isLoading = false,
}: AddScoutingReportModalProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [estimatedValue, setEstimatedValue] = useState<number>(250000);
  const [notes, setNotes] = useState("");

  const [attributes, setAttributes] = useState<Record<ScoutingAttribute, number>>({
    PACE: 75,
    SHOOTING: 75,
    PASSING: 75,
    DRIBBLING: 75,
    DEFENDING: 75,
    PHYSICAL: 75,
  });

  useEffect(() => {
    if (isOpen) {
      setPosition(defaultPosition);
      setEstimatedValue(250000);
      setNotes("");
      setAttributes({
        PACE: 75,
        SHOOTING: 75,
        PASSING: 75,
        DRIBBLING: 75,
        DEFENDING: 75,
        PHYSICAL: 75,
      });
    }
  }, [isOpen, defaultPosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate overall average rating (1-99)
  const attrValues = Object.values(attributes);
  const calculatedOverall = Math.round(
    attrValues.reduce((a, b) => a + b, 0) / attrValues.length
  );

  const handleAttributeChange = (attr: ScoutingAttribute, value: number) => {
    setAttributes((prev) => ({
      ...prev,
      [attr]: Math.min(99, Math.max(1, value)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validEstimatedValue = Math.max(0, estimatedValue || 0);
    onAddReport({
      position,
      estimatedValue: validEstimatedValue,
      notes: notes.trim() || "Standard match evaluation report.",
      attributes,
    });
  };

  const attributeLabels: Record<ScoutingAttribute, string> = {
    PACE: "Pace & Acceleration",
    SHOOTING: "Shooting & Finishing",
    PASSING: "Passing & Vision",
    DRIBBLING: "Dribbling & Ball Control",
    DEFENDING: "Defending & Positioning",
    PHYSICAL: "Physical & Stamina",
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
        aria-labelledby="add-report-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl text-card-foreground animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 id="add-report-title" className="text-base font-bold text-foreground flex items-center gap-2">
              <FilePlus className="h-5 w-5 text-primary" />
              File Scout Report for {targetName}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Grade technical attributes (1-99 scale) and record transfer evaluation notes.
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

        <form onSubmit={handleSubmit} className="mt-4 flex-1 space-y-4 pr-1">
          {/* Calculated Overall Preview */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-primary-subtle border border-primary/20">
            <div>
              <p className="text-xs font-semibold text-primary">Calculated Overall Rating</p>
              <p className="text-[11px] text-muted-foreground">Automatically averaged from 6 attributes</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-xs">
              {calculatedOverall}
            </div>
          </div>

          {/* Position & Estimated Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Observed Position
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Estimated Value ($)
              </label>
              <input
                type="number"
                min={0}
                step={10000}
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Math.max(0, Number(e.target.value)))}
                className="h-9 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-foreground focus:bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* 6 Attribute Sliders (1-99 Scale) */}
          <div className="space-y-3 pt-2 border-t border-border">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Attribute Ratings (1 - 99 Scale)
            </h3>

            {(Object.keys(attributeLabels) as ScoutingAttribute[]).map((attr) => {
              const val = attributes[attr];
              return (
                <div key={attr} className="space-y-1 bg-muted/30 p-2.5 rounded-xl border border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{attributeLabels[attr]}</span>
                    <span className="font-bold text-primary px-2 py-0.5 rounded-md bg-card border border-border">
                      {val} / 99
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={99}
                      value={val}
                      onChange={(e) => handleAttributeChange(attr, Number(e.target.value))}
                      className="flex-1 accent-primary cursor-pointer h-2 bg-muted rounded-lg"
                    />
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={val}
                      onChange={(e) => handleAttributeChange(attr, Number(e.target.value))}
                      className="w-14 h-7 text-center rounded-lg border border-border bg-card text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notes */}
          <div className="space-y-1.5 pt-2 border-t border-border">
            <label className="text-xs font-semibold text-foreground">
              Scout Evaluation Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record detailed match observations, Strengths, Weaknesses, and transfer recommendations..."
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
              <FilePlus className="h-3.5 w-3.5" />
              {isLoading ? "Filing Report..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

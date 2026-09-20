"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ChevronDown, Plus, X } from "lucide-react";
import type { FindingSeverity, Transfer, MedicalFinding } from "@/types/transfers.types";

export interface MedicalFindingInput {
  condition: string;
  severity: FindingSeverity;
  note: string;
  disqualifying: boolean;
}

function createEmptyFinding(): MedicalFindingInput {
  return { condition: "", severity: "MINOR", note: "", disqualifying: false };
}

interface RecordMedicalFindingModalProps {
  isOpen: boolean;
  transfer: Transfer | null;
  onClose: () => void;
  onRecord: (data: { transferId: string; findings: MedicalFindingInput[] }) => void;
  existingFindings?: MedicalFinding[];
  isLoading?: boolean;
}

export function RecordMedicalFindingModal({ isOpen, transfer, onClose, onRecord, existingFindings = [], isLoading = false }: RecordMedicalFindingModalProps) {
  const [findings, setFindings] = useState<MedicalFindingInput[]>([createEmptyFinding()]);
  const [expandedFindings, setExpandedFindings] = useState<Record<number, boolean>>({ 0: true });

  useEffect(() => {
    if (isOpen) {
      setFindings([createEmptyFinding()]);
      setExpandedFindings({ 0: true });
    }
  }, [isOpen, transfer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !transfer) return null;

  const updateFinding = <K extends keyof MedicalFindingInput>(index: number, key: K, value: MedicalFindingInput[K]) => {
    setFindings((current) => current.map((finding, findingIndex) => findingIndex === index ? { ...finding, [key]: value } : finding));
  };

  const removeFinding = (index: number) => {
    setFindings((current) => current.filter((_, findingIndex) => findingIndex !== index));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (findings.some((finding) => !finding.condition.trim() || !finding.note.trim())) return;
    onRecord({
      transferId: transfer.id,
      findings: findings.map((finding) => ({ ...finding, condition: finding.condition.trim(), note: finding.note.trim() })),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} aria-hidden="true" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="text-base font-bold text-foreground">Record medical finding</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{transfer.athleteName} · {transfer.id}</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close modal" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>
          <form id="record-medical-finding" onSubmit={handleSubmit} className="flex min-h-0 flex-col gap-4 p-5 text-xs">
            <div className="min-h-0 space-y-3 overflow-y-auto pr-1">
              {findings.map((finding, index) => (
                <div key={index} className="rounded-xl border border-border bg-muted/20 p-3">
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => setExpandedFindings((current) => ({ ...current, [index]: !current[index] }))} className="flex flex-1 items-center gap-2 text-left font-semibold text-foreground">
                      <ChevronDown className={`h-4 w-4 transition-transform ${expandedFindings[index] ? "rotate-180" : ""}`} />
                      Finding {index + 1}
                    </button>
                    {findings.length > 1 && <button type="button" onClick={() => removeFinding(index)} className="text-muted-foreground hover:text-danger" aria-label={`Remove finding ${index + 1}`}><X className="h-4 w-4" /></button>}
                  </div>
                  {expandedFindings[index] && <div className="mt-3 space-y-3">
                    <label className="block space-y-1">
                  <span className="font-medium text-foreground">Finding or condition <span className="text-danger">*</span></span>
                  <input required value={finding.condition} onChange={(event) => updateFinding(index, "condition", event.target.value)} placeholder="e.g. Mild hamstring strain" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground" />
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="space-y-1"><span className="font-medium text-foreground">Severity</span><select value={finding.severity} onChange={(event) => updateFinding(index, "severity", event.target.value as FindingSeverity)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground"><option value="MINOR">Minor</option><option value="MODERATE">Moderate</option><option value="SEVERE">Severe</option></select></label>
                  <label className="flex items-center gap-2 self-end rounded-xl border border-border p-2.5"><input type="checkbox" checked={finding.disqualifying} onChange={(event) => updateFinding(index, "disqualifying", event.target.checked)} className="h-4 w-4 accent-primary" /><span className="font-medium text-foreground">Disqualifying finding</span></label>
                    </div>
                    <label className="block space-y-1"><span className="font-medium text-foreground">Clinical note <span className="text-danger">*</span></span><textarea required rows={3} value={finding.note} onChange={(event) => updateFinding(index, "note", event.target.value)} placeholder="Describe the finding, recommended action, and restrictions" className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground" /></label>
                    {finding.disqualifying && <p className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/10 p-3 text-danger"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />This will disqualify the transfer.</p>}
                  </div>}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setFindings((current) => [...current, createEmptyFinding()])} className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 font-semibold text-primary hover:bg-primary/10"><Plus className="h-3.5 w-3.5" />Add another finding</button>
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
              <span>Existing findings: {existingFindings.length}</span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || findings.some((finding) => !finding.condition.trim() || !finding.note.trim())}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save finding"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X, Plus } from "lucide-react";
import type { FindingSeverity, Transfer, MedicalFinding } from "@/types/transfers.types";

interface RecordMedicalFindingModalProps {
  isOpen: boolean;
  transfer: Transfer | null;
  onClose: () => void;
  onRecord: (data: { transferId: string; condition: string; severity: FindingSeverity; note: string; disqualifying: boolean }) => void;
  existingFindings?: MedicalFinding[];
  isLoading?: boolean;
}

export function RecordMedicalFindingModal({ isOpen, transfer, onClose, onRecord, existingFindings = [], isLoading = false }: RecordMedicalFindingModalProps) {
  const [condition, setCondition] = useState("");
  const [severity, setSeverity] = useState<FindingSeverity>("MINOR");
  const [note, setNote] = useState("");
  const [disqualifying, setDisqualifying] = useState(false);

  useEffect(() => {
    setCondition("");
    setSeverity("MINOR");
    setNote("");
    setDisqualifying(false);
  }, [transfer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !transfer) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!condition.trim() || !note.trim()) return;
    onRecord({ transferId: transfer.id, condition: condition.trim(), severity, note: note.trim(), disqualifying });
    setCondition("");
    setSeverity("MINOR");
    setNote("");
    setDisqualifying(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} aria-hidden="true" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card text-card-foreground shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="text-base font-bold text-foreground">Record medical finding</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">{transfer.athleteName} · {transfer.id}</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close modal" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>
          <form id="record-medical-finding" onSubmit={handleSubmit} className="space-y-4 p-5 text-xs">
            <label className="block space-y-1">
              <span className="font-medium text-foreground">Finding or condition <span className="text-danger">*</span></span>
              <input
                required
                value={condition}
                onChange={(event) => setCondition(event.target.value)}
                placeholder="e.g. Mild hamstring strain"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground"
              />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="font-medium text-foreground">Severity</span>
                <select
                  value={severity}
                  onChange={(event) => setSeverity(event.target.value as FindingSeverity)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground"
                >
                  <option value="MINOR">Minor</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="SEVERE">Severe</option>
                </select>
              </label>
              <label className="flex items-center gap-2 self-end rounded-xl border border-border p-2.5">
                <input
                  type="checkbox"
                  checked={disqualifying}
                  onChange={(event) => setDisqualifying(event.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium text-foreground">Disqualifying finding</span>
              </label>
            </div>
            <label className="block space-y-1">
              <span className="font-medium text-foreground">Clinical note <span className="text-danger">*</span></span>
              <textarea
                required
                rows={4}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Describe the finding, recommended action, and restrictions"
                className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground"
              />
            </label>
            {disqualifying && <p className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger/10 p-3 text-danger"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />This will disqualify the transfer and drop its linked scouting target.</p>}
            <div className="flex items-center gap-3 pt-3 border-t border-border p-3 text-xs text-muted-foreground">
              <span>Existing findings: {existingFindings.length}</span>
              <button
                type="button"
                onClick={() => setCondition(""), setNote(""), setSeverity("MINOR"), setDisqualifying(false)}
                className="text-primary hover:underline cursor-pointer"
                title="Clear form"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => onClose()}
                className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !condition.trim() || !note.trim()}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save finding"}
              </button>
            </div>
          </form>
          {/* Add new finding section */}
          {existingFindings.length > 0 && (
            <div className="border-t border-border pt-4 mt-4 space-y-3 text-xs text-muted-foreground">
              <h4 className="font-semibold text-foreground">Existing findings</h4>
              {existingFindings.map((f) => (
                <div key={f.id} className="flex items-center gap-2">
                  <span className="flex-1">
                    <strong>{f.condition}</strong> ({f.severity}){f.disqualifying && <span className="text-rose-600">[Disqualifying]</span>}
                  </span>
                  <span>
                    <X
                      className="h-3 w-3 text-rose-500"
                      onClick={() => {
                        // TODO: Implement remove finding - would need to update the hook
                        // For now, just note it
                        console.log("Remove finding:", f.condition);
                      }}
                    />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
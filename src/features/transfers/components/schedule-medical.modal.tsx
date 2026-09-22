"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Stethoscope, X } from "lucide-react";
import type { Transfer } from "@/types/transfers.types";

interface ScheduleMedicalModalProps {
  isOpen: boolean;
  transfer: Transfer | null;
  onClose: () => void;
  onSchedule: (data: { transferId: string; examDate: string; clinician: string }) => void;
  isLoading?: boolean;
}

export function ScheduleMedicalModal({
  isOpen,
  transfer,
  onClose,
  onSchedule,
  isLoading = false,
}: ScheduleMedicalModalProps) {
  const [examDate, setExamDate] = useState("");
  const [clinician, setClinician] = useState("");

  useEffect(() => {
    if (!transfer) return;
    setExamDate(transfer.medicalExam?.examDate || new Date().toISOString().slice(0, 10));
    setClinician(transfer.medicalExam?.clinician || "");
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
    if (!examDate || !clinician.trim()) return;
    onSchedule({ transferId: transfer.id, examDate, clinician: clinician.trim() });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} aria-hidden="true" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-sky-500/10 p-2 text-sky-600 dark:text-sky-400"><Stethoscope className="h-5 w-5" /></div>
              <div><h2 className="text-base font-bold text-foreground">Schedule medical examination</h2><p className="text-xs text-muted-foreground">{transfer.athleteName}</p></div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close modal" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>
          <form id="schedule-medical-exam" onSubmit={handleSubmit} className="space-y-4 p-5 text-xs">
            <label className="block space-y-1"><span className="font-medium text-foreground">Examination date <span className="text-danger">*</span></span><div className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><input required type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-3 text-foreground" /></div></label>
            <label className="block space-y-1"><span className="font-medium text-foreground">Clinician <span className="text-danger">*</span></span><input required value={clinician} onChange={(event) => setClinician(event.target.value)} placeholder="e.g. Dr. Patrick Rutayisire" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground" /></label>
            <p className="rounded-xl border border-border bg-muted/30 p-3 text-[11px] leading-relaxed text-muted-foreground">Scheduling creates the medical review appointment. After the examination, record any findings from the transfer review flow.</p>
          </form>
          <div className="flex justify-end gap-3 border-t border-border p-4"><button type="button" onClick={onClose} className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted">Cancel</button><button type="submit" form="schedule-medical-exam" disabled={isLoading || !examDate || !clinician.trim()} className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-50">{isLoading ? "Scheduling..." : "Schedule examination"}</button></div>
        </div>
      </div>
    </div>
  );
}

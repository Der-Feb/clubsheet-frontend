"use client";

import { useEffect, useState } from "react";
import { ClipboardPlus, X } from "lucide-react";
import type { Member } from "@/types/members-roles.types";
import type { Signing } from "@/types/signings.types";
import type { Transfer } from "@/types/transfers.types";
import type { CreateMedicalRecordInput } from "@/hooks/use-medical.hook";
import type { MedicalRecordStatus, MedicalRecordType, MedicalTestResult } from "@/types/medical.types";

interface RecordMedicalTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (input: CreateMedicalRecordInput) => void;
  members: Member[];
  transfers: Transfer[];
  signings: Signing[];
  isLoading?: boolean;
}

const TYPE_LABEL: Record<MedicalRecordType, string> = {
  CHECKUP: "Checkup",
  INJURY: "Injury",
  DOPING_TEST: "Doping test",
};

export function RecordMedicalTestModal({
  isOpen,
  onClose,
  onCreate,
  members,
  transfers,
  signings,
  isLoading = false,
}: RecordMedicalTestModalProps) {
  const [membershipId, setMembershipId] = useState("");
  const [type, setType] = useState<MedicalRecordType>("CHECKUP");
  const [condition, setCondition] = useState("");
  const [dateOccurred, setDateOccurred] = useState(new Date().toISOString().slice(0, 10));
  const [severity, setSeverity] = useState<CreateMedicalRecordInput["severity"]>("MINOR");
  const [status, setStatus] = useState<MedicalRecordStatus>("RECOVERED");
  const [result, setResult] = useState<MedicalTestResult>("CLEARED");
  const [clinician, setClinician] = useState("");
  const [overallComments, setOverallComments] = useState("");
  const [transferId, setTransferId] = useState("");
  const [signingId, setSigningId] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (type === "INJURY") {
      setStatus("ACTIVE");
      setResult("FLAGGED");
    }
    if (type === "DOPING_TEST") {
      setStatus("RECOVERED");
      setResult("PENDING");
    }
  }, [type]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!membershipId || !condition.trim()) return;
    onCreate({
      membershipId,
      type,
      condition: condition.trim(),
      dateOccurred,
      severity,
      status,
      result,
      clinician: clinician.trim() || undefined,
      overallComments: overallComments.trim() || undefined,
      transferId: transferId || undefined,
      signingId: signingId || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} aria-hidden="true" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-card text-card-foreground shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-border p-5">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-primary/10 p-2 text-primary"><ClipboardPlus className="h-5 w-5" /></div>
              <div>
                <h2 className="text-base font-bold text-foreground">Record medical test</h2>
                <p className="text-xs text-muted-foreground">Log a checkup, injury, or competition doping test.</p>
              </div>
            </div>
            <button type="button" onClick={onClose} aria-label="Close modal" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>

          <form id="record-medical-test" onSubmit={handleSubmit} className="space-y-5 overflow-y-auto p-5 text-xs">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 sm:col-span-2"><span className="font-medium text-foreground">Member <span className="text-danger">*</span></span>
                <select required value={membershipId} onChange={(event) => setMembershipId(event.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground">
                  <option value="">Select a member</option>
                  {members.map((member) => <option key={member.id} value={member.id}>{member.name} — {member.role}</option>)}
                </select>
              </label>
              <label className="space-y-1"><span className="font-medium text-foreground">Record type</span>
                <select value={type} onChange={(event) => setType(event.target.value as MedicalRecordType)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground">
                  {(Object.keys(TYPE_LABEL) as MedicalRecordType[]).map((recordType) => <option key={recordType} value={recordType}>{TYPE_LABEL[recordType]}</option>)}
                </select>
              </label>
              <label className="space-y-1"><span className="font-medium text-foreground">Date</span>
                <input required type="date" value={dateOccurred} onChange={(event) => setDateOccurred(event.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground" />
              </label>
              <label className="space-y-1 sm:col-span-2"><span className="font-medium text-foreground">Test or condition <span className="text-danger">*</span></span>
                <input required value={condition} onChange={(event) => setCondition(event.target.value)} placeholder={type === "INJURY" ? "e.g. Grade 2 hamstring strain" : type === "DOPING_TEST" ? "e.g. In-competition urine sample" : "e.g. Pre-signing physical"} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground" />
              </label>
              <label className="space-y-1"><span className="font-medium text-foreground">Result</span>
                <select value={result} onChange={(event) => setResult(event.target.value as MedicalTestResult)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground">
                  {(["PENDING", "CLEARED", "FLAGGED", "POSITIVE"] as MedicalTestResult[]).map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <label className="space-y-1"><span className="font-medium text-foreground">Recovery status</span>
                <select value={status} onChange={(event) => setStatus(event.target.value as MedicalRecordStatus)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground">
                  {(["ACTIVE", "RECOVERING", "RECOVERED"] as MedicalRecordStatus[]).map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <label className="space-y-1"><span className="font-medium text-foreground">Severity</span>
                <select value={severity} onChange={(event) => setSeverity(event.target.value as CreateMedicalRecordInput["severity"])} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground">
                  {(["MINOR", "MODERATE", "SEVERE"] as const).map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
              <label className="space-y-1"><span className="font-medium text-foreground">Clinician</span>
                <input value={clinician} onChange={(event) => setClinician(event.target.value)} placeholder="Clinician or laboratory" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground" />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
              <label className="space-y-1"><span className="font-medium text-foreground">Related transfer</span>
                <select value={transferId} onChange={(event) => setTransferId(event.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground"><option value="">Not linked</option>{transfers.map((transfer) => <option key={transfer.id} value={transfer.id}>{transfer.athleteName} — {transfer.id}</option>)}</select>
              </label>
              <label className="space-y-1"><span className="font-medium text-foreground">Related signing</span>
                <select value={signingId} onChange={(event) => setSigningId(event.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground"><option value="">Not linked</option>{signings.map((signing) => <option key={signing.id} value={signing.id}>{signing.athleteName} — {signing.id}</option>)}</select>
              </label>
            </div>
            <label className="block space-y-1"><span className="font-medium text-foreground">Overall comments</span>
              <textarea value={overallComments} onChange={(event) => setOverallComments(event.target.value)} rows={3} placeholder="Clinical summary, restrictions, or laboratory notes" className="w-full resize-y rounded-xl border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground" />
            </label>
          </form>

          <div className="flex justify-end gap-3 border-t border-border p-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted">Cancel</button>
            <button type="submit" form="record-medical-test" disabled={isLoading || !membershipId || !condition.trim()} className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-50">{isLoading ? "Recording..." : "Record test"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Activity, CalendarDays } from "lucide-react";
import { useMedicalRecordsByMembership } from "@/hooks/use-medical.hook";
import type { MedicalRecordStatus } from "@/types/medical.types";

const STATUS_STYLE: Record<MedicalRecordStatus, string> = {
  ACTIVE: "border border-danger/20 bg-danger/10 text-danger",
  RECOVERING: "border border-border bg-muted text-muted-foreground",
  RECOVERED: "border border-border bg-muted text-muted-foreground",
};

export function MedicalHistoryTable({ membershipId }: { membershipId: string }) {
  const { data: records = [], isLoading } = useMedicalRecordsByMembership(membershipId);

  if (isLoading) {
    return <p className="py-6 text-center text-xs text-muted-foreground">Loading medical history...</p>;
  }

  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
        No medical history has been recorded for this member.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[580px] text-left text-xs">
        <thead className="bg-muted/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Condition</th>
            <th className="px-4 py-3">Occurred</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {records.map((record) => (
            <tr key={record.id} className="transition-colors hover:bg-muted/40">
              <td className="px-4 py-3 font-medium text-foreground">
                <span className="inline-flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  {record.condition}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {record.dateOccurred}
                </span>
              </td>
              <td className="px-4 py-3 text-foreground">{record.severity}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLE[record.status]}`}>
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

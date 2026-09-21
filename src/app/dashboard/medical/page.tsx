"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Activity, ClipboardPlus, FileSignature, FlaskConical, Search, ShieldAlert, Stethoscope } from "lucide-react";
import { RecordMedicalTestModal } from "@/features/medical/components/record-medical-test.modal";
import { useCreateMedicalRecord, useMedicalRecords } from "@/hooks/use-medical.hook";
import { useMembers } from "@/hooks/use-members-roles.hook";
import { useSignings } from "@/hooks/use-signings.hook";
import { useTransfers } from "@/hooks/use-transfers.hook";
import { useRecordMedicalFindings } from "@/hooks/use-transfers.hook";
import { RecordMedicalFindingModal } from "@/features/transfers/components/record-medical-finding.modal";
import type { MedicalRecord, MedicalRecordType, MedicalTestResult } from "@/types/medical.types";

const TYPE_LABEL: Record<MedicalRecordType, string> = {
  CHECKUP: "Checkup",
  INJURY: "Injury",
  DOPING_TEST: "Doping test",
};

const RESULT_STYLE: Record<MedicalTestResult, string> = {
  PENDING: "border-border bg-muted text-muted-foreground",
  CLEARED: "border-primary/20 bg-primary-subtle text-primary",
  FLAGGED: "border-danger/20 bg-danger/10 text-danger",
  POSITIVE: "border-danger/20 bg-danger/10 text-danger",
};

export default function MedicalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [typeFilter, setTypeFilter] = useState<MedicalRecordType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const recordTestParam = searchParams.get("recordTest");
  const recordFindingParam = searchParams.get("recordFinding");
  const transferIdParam = searchParams.get("transferId");
  const { data: records = [], isLoading } = useMedicalRecords();
  const { data: members = [] } = useMembers();
  const { data: transfers = [] } = useTransfers();
  const { data: signings = [] } = useSignings();
  const createRecordMutation = useCreateMedicalRecord();
  const recordFindingMutation = useRecordMedicalFindings();
  const reviewTransfer = recordFindingParam === "active" && transferIdParam
    ? transfers.find((transfer) => transfer.id === transferIdParam) || null
    : null;
  const isRecordModalOpen = recordTestParam === "active";

  const membersById = useMemo(() => new Map(members.map((member) => [member.id, member])), [members]);
  const filteredRecords = records.filter((record) => {
    if (typeFilter !== "ALL" && record.type !== typeFilter) return false;
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const member = membersById.get(record.membershipId);
    return [record.condition, record.type, record.result, member?.name || "", record.clinician || ""]
      .some((value) => value.toLowerCase().includes(query));
  });

  const pendingCount = records.filter((record) => record.result === "PENDING").length;
  const activeInjuries = records.filter((record) => record.type === "INJURY" && record.status !== "RECOVERED").length;
  const flaggedCount = records.filter((record) => record.result === "FLAGGED" || record.result === "POSITIVE").length;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const completedThisMonth = records.filter((record) => record.createdAt.slice(0, 7) === currentMonth && record.result !== "PENDING").length;

  const getMemberName = (record: MedicalRecord) => membersById.get(record.membershipId)?.name || "Unknown member";
  const medicalTransfers = transfers.filter((transfer) => transfer.medicalExam);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2"><Stethoscope className="h-6 w-6 text-primary" /><h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Medical</h1></div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Clinical tests, injuries, doping controls, and linked transfer or signing records.</p>
        </div>
        <button type="button" onClick={() => router.push("/dashboard/medical?recordTest=active")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary-hover"><ClipboardPlus className="h-4 w-4" /> Record medical test</button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending results" value={pendingCount} icon={<FlaskConical className="h-4 w-4" />} description="Awaiting clinician or lab outcome" />
        <StatCard label="Active injuries" value={activeInjuries} icon={<Activity className="h-4 w-4" />} description="Recovery follow-up required" />
        <StatCard label="Flagged results" value={flaggedCount} icon={<ShieldAlert className="h-4 w-4" />} description="Requires medical review" />
        <StatCard label="Completed this month" value={completedThisMonth} icon={<Stethoscope className="h-4 w-4" />} description="Recorded outcomes this month" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex overflow-x-auto rounded-xl border border-border bg-muted/30 p-1">
          {(["ALL", "CHECKUP", "INJURY", "DOPING_TEST"] as const).map((type) => <button key={type} type="button" onClick={() => setTypeFilter(type)} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${typeFilter === type ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}>{type === "ALL" ? "All records" : TYPE_LABEL[type]}</button>)}
        </div>
        <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search member, test, clinician..." className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground" /></div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
        <table className="w-full min-w-[61.25rem] text-left text-xs">
          <thead className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Member</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Test / condition</th><th className="px-4 py-3">Result</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Comments</th><th className="px-4 py-3">Connected record</th></tr></thead>
          <tbody className="divide-y divide-border">
            {isLoading ? <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Loading medical records...</td></tr> : filteredRecords.length === 0 ? <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No medical records match these filters.</td></tr> : filteredRecords.map((record) => (
              <tr key={record.id} className="transition-colors hover:bg-muted/40">
                <td className="px-4 py-3 font-semibold text-foreground">{getMemberName(record)}</td>
                <td className="px-4 py-3 text-foreground">{TYPE_LABEL[record.type]}</td>
                <td className="px-4 py-3"><p className="font-medium text-foreground">{record.condition}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{record.severity} · {record.status}</p></td>
                <td className="px-4 py-3"><span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${RESULT_STYLE[record.result]}`}>{record.result}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{record.dateOccurred}</td>
                <td className="max-w-56 px-4 py-3 text-muted-foreground"><p className="line-clamp-2">{record.overallComments || "No overall comments"}</p></td>
                <td className="px-4 py-3">{record.transferId ? <Link href={`/dashboard/transfers/${record.transferId}`} className="inline-flex items-center gap-1 text-primary hover:underline"><FileSignature className="h-3.5 w-3.5" /> Transfer</Link> : record.signingId ? <Link href={`/dashboard/signings/${record.signingId}`} className="inline-flex items-center gap-1 text-primary hover:underline"><FileSignature className="h-3.5 w-3.5" /> Signing</Link> : <span className="text-muted-foreground">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="space-y-3">
        <div><h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Transfer medical reviews</h2><p className="mt-1 text-xs text-muted-foreground">Scheduled transfer examinations and clinical findings.</p></div>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
          <table className="w-full min-w-[47.5rem] text-left text-xs"><thead className="border-b border-border bg-muted/40 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3">Athlete</th><th className="px-4 py-3">Exam date</th><th className="px-4 py-3">Clinician</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Findings</th><th className="px-4 py-3">Action</th></tr></thead><tbody className="divide-y divide-border">{medicalTransfers.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No transfer medical examinations scheduled.</td></tr> : medicalTransfers.map((transfer) => <tr key={transfer.id} className="hover:bg-muted/40"><td className="px-4 py-3 font-semibold text-foreground">{transfer.athleteName}<Link href={`/dashboard/transfers/${transfer.id}`} className="ml-2 text-[10px] font-normal text-primary hover:underline">Open transfer</Link></td><td className="px-4 py-3 text-muted-foreground">{transfer.medicalExam?.examDate}</td><td className="px-4 py-3 text-foreground">{transfer.medicalExam?.clinician}</td><td className="px-4 py-3"><span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold text-foreground">{transfer.medicalExam?.status}</span></td><td className="px-4 py-3 text-foreground">{transfer.medicalExam?.findings.length || 0}</td><td className="px-4 py-3"><button type="button" onClick={() => router.push(`/dashboard/medical?transferId=${transfer.id}&recordFinding=active`)} className="rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/10">Add finding</button></td></tr>)}</tbody></table>
        </div>
      </section>

      <RecordMedicalTestModal isOpen={isRecordModalOpen} onClose={() => router.push("/dashboard/medical")} onCreate={(input) => createRecordMutation.mutate(input, { onSuccess: () => router.push("/dashboard/medical") })} members={members} transfers={transfers} signings={signings} isLoading={createRecordMutation.isPending} />
      <RecordMedicalFindingModal isOpen={Boolean(reviewTransfer)} transfer={reviewTransfer} onClose={() => router.push("/dashboard/medical")} onRecord={(data) => recordFindingMutation.mutate(data, { onSuccess: () => router.push("/dashboard/medical") })} isLoading={recordFindingMutation.isPending} />
    </div>
  );
}

function StatCard({ label, value, icon, description }: { label: string; value: number; icon: React.ReactNode; description: string }) {
  return <div className="rounded-2xl border border-border bg-card p-4 shadow-xs"><div className="flex items-center justify-between"><span className="text-xs font-medium text-muted-foreground">{label}</span><span className="rounded-xl bg-primary/10 p-2 text-primary">{icon}</span></div><p className="mt-2 text-2xl font-bold text-foreground">{value}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p></div>;
}

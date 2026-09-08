import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Dumbbell,
  FileText,
  Activity,
  Phone,
  Mail,
} from "lucide-react";

interface PlayerProfileProps {
  params: Promise<{ playerId: string }>;
}

export default async function PlayerProfilePage({ params }: PlayerProfileProps) {
  const { playerId } = await params;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/players"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Players
        </Link>
      </div>

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-card-foreground">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-sm">
              JM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">John Mugabo</h1>
                <span className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                  Active
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Forward • Jersey #9 • Senior Team
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">ID: {playerId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              className="flex-1 sm:flex-initial rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Medical Record
            </button>
            <button
              type="button"
              className="flex-1 sm:flex-initial rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover transition-colors shadow-xs cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Quick details chips */}
        <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block">Date of Birth</span>
            <span className="font-semibold text-foreground">14 May 2002 (24 yrs)</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Nationality</span>
            <span className="font-semibold text-foreground">Rwandan 🇷🇼</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Contract Status</span>
            <span className="font-semibold text-foreground">Pro (Until June 2027)</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Attendance Rate</span>
            <span className="font-semibold text-primary">96.4%</span>
          </div>
        </div>
      </div>

      {/* Tabs / Subsections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance & Training Summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 text-card-foreground">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Season Performance
            </h2>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-muted/40 p-3 border border-border">
                <span className="text-xl font-bold text-foreground">14</span>
                <span className="text-[11px] text-muted-foreground block">Appearances</span>
              </div>
              <div className="rounded-xl bg-muted/40 p-3 border border-border">
                <span className="text-xl font-bold text-primary">9</span>
                <span className="text-[11px] text-muted-foreground block">Goals</span>
              </div>
              <div className="rounded-xl bg-muted/40 p-3 border border-border">
                <span className="text-xl font-bold text-foreground">4</span>
                <span className="text-[11px] text-muted-foreground block">Assists</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 text-card-foreground">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-primary" />
              Recent Training Attendance
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
                <div>
                  <p className="font-medium text-foreground">Tactical Preparation</p>
                  <p className="text-[11px] text-muted-foreground">Sep 6, 2026 • Pitch A</p>
                </div>
                <span className="font-semibold text-primary">Attended</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border">
                <div>
                  <p className="font-medium text-foreground">Conditioning & Sprints</p>
                  <p className="text-[11px] text-muted-foreground">Sep 4, 2026 • Gym</p>
                </div>
                <span className="font-semibold text-primary">Attended</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Club Documents */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 text-card-foreground">
            <h2 className="text-sm font-bold text-foreground">Contact Details</h2>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground">+250 788 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground">j.mugabo@kigalifc.rw</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground">Kigali, Gasabo District</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 text-card-foreground">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Attached Documents
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                <span className="font-medium text-foreground">Contract_2026.pdf</span>
                <span className="text-[10px] text-muted-foreground">1.2 MB</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                <span className="font-medium text-foreground">Medical_Clearance.pdf</span>
                <span className="text-[10px] text-muted-foreground">450 KB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

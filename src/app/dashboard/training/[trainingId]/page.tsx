import Link from "next/link";
import {
  ArrowLeft,
  Dumbbell,
  FileText,
} from "lucide-react";

interface TrainingDetailProps {
  params: Promise<{ trainingId: string }>;
}

export default async function TrainingDetailPage({
  params,
}: TrainingDetailProps) {
  const { trainingId } = await params;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <Link
          href="/dashboard/training"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Training
        </Link>
      </div>

      {/* Session Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-card-foreground">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                Tactical Session
              </span>
              <span className="text-xs text-muted-foreground font-mono">ID: {trainingId}</span>
            </div>
            <h1 className="mt-2 text-xl font-bold text-foreground">
              Tactical Preparation & Set Pieces
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Senior First Team • Head Coach: Emmanuel Mugisha
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
            >
              Take Attendance
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground block">Date & Time</span>
            <span className="font-semibold text-foreground">Sep 7, 18:00 - 19:30</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Pitch / Facility</span>
            <span className="font-semibold text-foreground">Pitch A (Main Stadium)</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Attendance Status</span>
            <span className="font-semibold text-primary">24 / 26 Confirmed</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Equipment Plan</span>
            <span className="font-semibold text-foreground">Bibs, Cones, 24 Balls</span>
          </div>
        </div>
      </div>

      {/* Drills & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 text-card-foreground">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            Session Drill Plan
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border">
              <p className="font-semibold text-foreground">1. Warm-up & Rondos (15 mins)</p>
              <p className="text-muted-foreground mt-1">
                5v2 high tempo possession drill in 10x10 grid. Focus on 1-touch passes.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border">
              <p className="font-semibold text-foreground">2. Defensive Shape & Transition (35 mins)</p>
              <p className="text-muted-foreground mt-1">
                Compact 4-4-2 block against 3-line overload. Quick release to wingers.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border">
              <p className="font-semibold text-foreground">3. Attacking Corner Routines (25 mins)</p>
              <p className="text-muted-foreground mt-1">
                Near post flick-on and back-post blindside runner variations.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3 text-card-foreground">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Coach Notes & Absences
          </h2>
          <div className="space-y-2.5 text-xs text-muted-foreground">
            <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 text-warning">
              <p className="font-semibold">Medical Exemption</p>
              <p className="text-xs text-warning/90 mt-0.5">
                David Kwizera is completing rehab with physio team; no contact drills allowed.
              </p>
            </div>
            <p className="p-3 rounded-xl bg-muted/40 border border-border text-foreground">
              Video analysis review will take place in lecture room 2 at 17:30 prior to pitch warm-up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

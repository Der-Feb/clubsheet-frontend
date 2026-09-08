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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Training
        </Link>
      </div>

      {/* Session Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-[#005F31]">
                Tactical Session
              </span>
              <span className="text-xs text-zinc-400 font-mono">ID: {trainingId}</span>
            </div>
            <h1 className="mt-2 text-xl font-bold text-zinc-900">
              Tactical Preparation & Set Pieces
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Senior First Team • Head Coach: Emmanuel Mugisha
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg bg-[#005F31] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#01562D]"
            >
              Take Attendance
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-zinc-400 block">Date & Time</span>
            <span className="font-semibold text-zinc-800">Sep 7, 18:00 - 19:30</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Pitch / Facility</span>
            <span className="font-semibold text-zinc-800">Pitch A (Main Stadium)</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Attendance Status</span>
            <span className="font-semibold text-[#005F31]">24 / 26 Confirmed</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Equipment Plan</span>
            <span className="font-semibold text-zinc-800">Bibs, Cones, 24 Balls</span>
          </div>
        </div>
      </div>

      {/* Drills & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-[#005F31]" />
            Session Drill Plan
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
              <p className="font-semibold text-zinc-800">1. Warm-up & Rondos (15 mins)</p>
              <p className="text-zinc-500 mt-1">
                5v2 high tempo possession drill in 10x10 grid. Focus on 1-touch passes.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
              <p className="font-semibold text-zinc-800">2. Defensive Shape & Transition (35 mins)</p>
              <p className="text-zinc-500 mt-1">
                Compact 4-4-2 block against 3-line overload. Quick release to wingers.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
              <p className="font-semibold text-zinc-800">3. Attacking Corner Routines (25 mins)</p>
              <p className="text-zinc-500 mt-1">
                Near post flick-on and back-post blindside runner variations.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#005F31]" />
            Coach Notes & Absences
          </h2>
          <div className="space-y-2.5 text-xs text-zinc-600">
            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 text-amber-900">
              <p className="font-semibold">Medical Exemption</p>
              <p className="text-xs text-amber-800 mt-0.5">
                David Kwizera is completing rehab with physio team; no contact drills allowed.
              </p>
            </div>
            <p className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-700">
              Video analysis review will take place in lecture room 2 at 17:30 prior to pitch warm-up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

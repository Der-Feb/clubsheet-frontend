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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Players
        </Link>
      </div>

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#005F31] text-xl font-bold text-white shadow-sm">
              JM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-zinc-900">John Mugabo</h1>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-[#005F31]">
                  Active
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Forward • Jersey #9 • Senior Team
              </p>
              <p className="text-xs text-zinc-400 mt-1 font-mono">ID: {playerId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              className="flex-1 sm:flex-initial rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Medical Record
            </button>
            <button
              type="button"
              className="flex-1 sm:flex-initial rounded-lg bg-[#005F31] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#01562D]"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Quick details chips */}
        <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-zinc-400 block">Date of Birth</span>
            <span className="font-semibold text-zinc-800">14 May 2002 (24 yrs)</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Nationality</span>
            <span className="font-semibold text-zinc-800">Rwandan 🇷🇼</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Contract Status</span>
            <span className="font-semibold text-zinc-800">Pro (Until June 2027)</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Attendance Rate</span>
            <span className="font-semibold text-[#005F31]">96.4%</span>
          </div>
        </div>
      </div>

      {/* Tabs / Subsections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance & Training Summary */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#005F31]" />
              Season Performance
            </h2>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-100">
                <span className="text-xl font-bold text-zinc-900">14</span>
                <span className="text-[11px] text-zinc-400 block">Appearances</span>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-100">
                <span className="text-xl font-bold text-[#005F31]">9</span>
                <span className="text-[11px] text-zinc-400 block">Goals</span>
              </div>
              <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-100">
                <span className="text-xl font-bold text-zinc-900">4</span>
                <span className="text-[11px] text-zinc-400 block">Assists</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-[#005F31]" />
              Recent Training Attendance
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50">
                <div>
                  <p className="font-medium text-zinc-800">Tactical Preparation</p>
                  <p className="text-[11px] text-zinc-400">Sep 6, 2026 • Pitch A</p>
                </div>
                <span className="font-semibold text-[#005F31]">Attended</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50">
                <div>
                  <p className="font-medium text-zinc-800">Conditioning & Sprints</p>
                  <p className="text-[11px] text-zinc-400">Sep 4, 2026 • Gym</p>
                </div>
                <span className="font-semibold text-[#005F31]">Attended</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Club Documents */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-zinc-900">Contact Details</h2>
            <div className="space-y-2.5 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-zinc-400" />
                <span>+250 788 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                <span>j.mugabo@kigalifc.rw</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                <span>Kigali, Gasabo District</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#005F31]" />
              Attached Documents
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 hover:bg-zinc-50">
                <span className="font-medium text-zinc-700">Contract_2026.pdf</span>
                <span className="text-[10px] text-zinc-400">1.2 MB</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 hover:bg-zinc-50">
                <span className="font-medium text-zinc-700">Medical_Clearance.pdf</span>
                <span className="text-[10px] text-zinc-400">450 KB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

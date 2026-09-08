import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Users,
} from "lucide-react";

interface TeamDetailProps {
  params: Promise<{ teamId: string }>;
}

export default async function TeamDetailPage({ params }: TeamDetailProps) {
  const { teamId } = await params;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <Link
          href="/dashboard/teams"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Teams
        </Link>
      </div>

      {/* Team Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#005F31] text-white shadow-sm">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-zinc-900">
                  Senior First Team
                </h1>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-[#005F31]">
                  Rwanda Premier League
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Head Coach: Emmanuel Mugisha • Team Code: {teamId}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg bg-[#005F31] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#01562D]"
          >
            Manage Squad
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-zinc-400 block">Active Squad</span>
            <span className="font-semibold text-zinc-800">26 Players</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Average Age</span>
            <span className="font-semibold text-zinc-800">23.8 Years</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Training Pitch</span>
            <span className="font-semibold text-zinc-800">Pitch A (Main Stadium)</span>
          </div>
          <div>
            <span className="text-zinc-400 block">Season Form</span>
            <span className="font-semibold text-[#005F31]">W - W - D - W - L</span>
          </div>
        </div>
      </div>

      {/* Squad List Preview */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-[#005F31]" />
            Squad Roster Preview
          </h2>
          <span className="text-xs text-zinc-400">26 registered</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: "John Mugabo", pos: "Forward", num: 9, status: "Starter" },
            { name: "Eric Nshimiyimana", pos: "Midfielder", num: 8, status: "Starter" },
            { name: "Claude Habimana", pos: "Goalkeeper", num: 1, status: "Starter" },
            { name: "Aimable Kagame", pos: "Midfielder", num: 10, status: "Starter" },
            { name: "Samuel Bizimungu", pos: "Defender", num: 4, status: "Sub" },
            { name: "Olivier Rukundo", pos: "Defender", num: 2, status: "Sub" },
          ].map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50/60"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-zinc-400">
                  #{p.num}
                </span>
                <div>
                  <p className="text-xs font-semibold text-zinc-800">{p.name}</p>
                  <p className="text-[11px] text-zinc-400">{p.pos}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-zinc-500 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

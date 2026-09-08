import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  MapPin,
  Users,
  Shield,
} from "lucide-react";

interface MatchDetailProps {
  params: Promise<{ matchId: string }>;
}

export default async function MatchDetailPage({ params }: MatchDetailProps) {
  const { matchId } = await params;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <Link
          href="/dashboard/matches"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Matches
        </Link>
      </div>

      {/* Matchday Banner */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-[#005F31]">
          <Trophy className="h-3.5 w-3.5" />
          Rwanda Premier League • Matchday 14
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 py-4">
          <div className="flex flex-col items-center gap-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#005F31] text-lg font-bold text-white shadow-sm">
              KFC
            </span>
            <span className="text-lg font-bold text-zinc-900">Kigali FC</span>
            <span className="text-xs text-zinc-400">Home</span>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-black text-zinc-300">VS</span>
            <p className="text-xs font-semibold text-[#005F31]">Saturday, 15:00</p>
            <p className="text-[11px] text-zinc-400 font-mono">ID: {matchId}</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-200 text-lg font-bold text-zinc-800 shadow-sm">
              APR
            </span>
            <span className="text-lg font-bold text-zinc-900">APR FC</span>
            <span className="text-xs text-zinc-400">Away</span>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-600">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-zinc-400" />
            Amahoro National Stadium, Remera
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-zinc-400" />
            Capacity: 45,000
          </span>
        </div>
      </div>

      {/* Provisional Starting Lineup */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#005F31]" />
          Confirmed Matchday Squad (4-3-3)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { num: 1, name: "Claude Habimana", role: "Goalkeeper" },
            { num: 2, name: "Olivier Rukundo", role: "Right Back" },
            { num: 4, name: "Samuel Bizimungu", role: "Centre Back" },
            { num: 5, name: "Jean Paul N.", role: "Centre Back" },
            { num: 3, name: "Eric Ndahiro", role: "Left Back" },
            { num: 6, name: "Faustin M.", role: "Defensive Midfielder" },
            { num: 8, name: "Eric Nshimiyimana", role: "Central Midfielder" },
            { num: 10, name: "Aimable Kagame", role: "Attacking Midfielder" },
            { num: 7, name: "Patrick Bizimana", role: "Right Winger" },
            { num: 9, name: "John Mugabo", role: "Striker (Captain)" },
            { num: 11, name: "Dieudonné K.", role: "Left Winger" },
          ].map((player) => (
            <div
              key={player.num}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white font-mono text-xs font-bold text-zinc-700 shadow-2xs border border-zinc-200">
                {player.num}
              </span>
              <div>
                <p className="text-xs font-semibold text-zinc-800">{player.name}</p>
                <p className="text-[10px] text-zinc-400">{player.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

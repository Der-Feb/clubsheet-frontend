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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Matches
        </Link>
      </div>

      {/* Matchday Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-center space-y-4 text-card-foreground">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-subtle px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
          <Trophy className="h-3.5 w-3.5" />
          Rwanda Premier League • Matchday 14
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 py-4">
          <div className="flex flex-col items-center gap-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground shadow-sm">
              KFC
            </span>
            <span className="text-lg font-bold text-foreground">Kigali FC</span>
            <span className="text-xs text-muted-foreground">Home</span>
          </div>

          <div className="space-y-1">
            <span className="text-2xl font-black text-muted-foreground/40">VS</span>
            <p className="text-xs font-semibold text-primary">Saturday, 15:00</p>
            <p className="text-[11px] text-muted-foreground font-mono">ID: {matchId}</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted border border-border text-lg font-bold text-foreground shadow-sm">
              APR
            </span>
            <span className="text-lg font-bold text-foreground">APR FC</span>
            <span className="text-xs text-muted-foreground">Away</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            Amahoro National Stadium, Remera
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            Capacity: 45,000
          </span>
        </div>
      </div>

      {/* Provisional Starting Lineup */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 text-card-foreground">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
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
          ].map((athlete) => (
            <div
              key={athlete.num}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-border bg-muted/40"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-card font-mono text-xs font-bold text-foreground shadow-2xs border border-border">
                {athlete.num}
              </span>
              <div>
                <p className="text-xs font-semibold text-foreground">{athlete.name}</p>
                <p className="text-[10px] text-muted-foreground">{athlete.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

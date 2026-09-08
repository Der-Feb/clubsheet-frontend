import Link from "next/link";
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Filter,
} from "lucide-react";

interface TrainingSession {
  id: string;
  title: string;
  team: string;
  date: string;
  time: string;
  pitch: string;
  coach: string;
  confirmedPlayers: number;
  totalPlayers: number;
  type: "Tactical" | "Technical" | "Conditioning" | "Recovery";
}

const SESSIONS: TrainingSession[] = [
  {
    id: "tr-101",
    title: "Tactical Preparation & Set Pieces",
    team: "Senior First Team",
    date: "Today, Sep 7",
    time: "18:00 - 19:30",
    pitch: "Pitch A (Main Stadium)",
    coach: "Emmanuel Mugisha",
    confirmedPlayers: 24,
    totalPlayers: 26,
    type: "Tactical",
  },
  {
    id: "tr-102",
    title: "Passing Sequences & High Pressing",
    team: "Under-17 Academy",
    date: "Tomorrow, Sep 8",
    time: "16:30 - 18:00",
    pitch: "Pitch B (Turf)",
    coach: "Dieudonné Habimana",
    confirmedPlayers: 19,
    totalPlayers: 22,
    type: "Technical",
  },
  {
    id: "tr-103",
    title: "Aerobic Capacity & Speed Endurance",
    team: "Under-15 Development",
    date: "Wednesday, Sep 9",
    time: "16:00 - 17:30",
    pitch: "Pitch C & Gym",
    coach: "Moses Karasira",
    confirmedPlayers: 22,
    totalPlayers: 24,
    type: "Conditioning",
  },
  {
    id: "tr-104",
    title: "Pre-Match Activation & Shooting Drills",
    team: "Senior First Team",
    date: "Friday, Sep 11",
    time: "17:00 - 18:15",
    pitch: "Pitch A (Main Stadium)",
    coach: "Emmanuel Mugisha",
    confirmedPlayers: 26,
    totalPlayers: 26,
    type: "Recovery",
  },
];

export default function TrainingPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Training
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Schedule practice sessions, design drill plans, and track squad
            attendance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted shadow-xs transition-colors cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            Calendar View
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Schedule Session
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border shadow-xs text-card-foreground">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-muted-foreground">Filter by squad:</span>
          <button
            type="button"
            className="rounded-lg bg-primary-subtle px-2.5 py-1 text-primary font-semibold border border-primary/20 cursor-pointer"
          >
            All Squads
          </button>
          <button
            type="button"
            className="rounded-lg px-2.5 py-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            Senior Team
          </button>
          <button
            type="button"
            className="rounded-lg px-2.5 py-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            U17 Academy
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            <Filter className="h-3 w-3" />
            This Week (Sep 7 - 13)
          </button>
        </div>
      </div>

      {/* Session Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Upcoming Practice Sessions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SESSIONS.map((session) => (
            <div
              key={session.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/40 transition-all space-y-4 flex flex-col justify-between text-card-foreground"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-primary-subtle px-2.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                    {session.type}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {session.team}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {session.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Led by {session.coach}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {session.date}
                    </span>
                    <span className="text-muted-foreground/60">•</span>
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{session.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{session.pitch}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      {session.confirmedPlayers}/{session.totalPlayers} Confirmed
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] font-medium text-success">
                  Attendance sheet open
                </span>
                <Link
                  href={`/dashboard/training/${session.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  View Details <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

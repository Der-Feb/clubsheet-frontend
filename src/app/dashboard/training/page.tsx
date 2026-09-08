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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Training
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Schedule practice sessions, design drill plans, and track squad
            attendance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 shadow-xs"
          >
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            Calendar View
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#005F31] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#01562D] shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Schedule Session
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-zinc-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-zinc-400">Filter by squad:</span>
          <button
            type="button"
            className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[#005F31] font-semibold"
          >
            All Squads
          </button>
          <button
            type="button"
            className="rounded-lg px-2.5 py-1 text-zinc-600 hover:bg-zinc-100"
          >
            Senior Team
          </button>
          <button
            type="button"
            className="rounded-lg px-2.5 py-1 text-zinc-600 hover:bg-zinc-100"
          >
            U17 Academy
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 hover:bg-zinc-50"
          >
            <Filter className="h-3 w-3" />
            This Week (Sep 7 - 13)
          </button>
        </div>
      </div>

      {/* Session Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Upcoming Practice Sessions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SESSIONS.map((session) => (
            <div
              key={session.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-zinc-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-[#005F31]">
                    {session.type}
                  </span>
                  <span className="text-xs font-medium text-zinc-500">
                    {session.team}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900">
                    {session.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    Led by {session.coach}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-zinc-100 text-xs text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="font-medium text-zinc-800">
                      {session.date}
                    </span>
                    <span className="text-zinc-400">•</span>
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{session.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{session.pitch}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-zinc-400" />
                    <span>
                      {session.confirmedPlayers}/{session.totalPlayers} Confirmed
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-emerald-600">
                  Attendance sheet open
                </span>
                <Link
                  href={`/dashboard/training/${session.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#005F31] hover:underline"
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

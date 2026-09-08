import Link from "next/link";
import {
  Users,
  Shield,
  Dumbbell,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  ArrowUpRight,
  Plus,
  UserPlus,
  FileCheck,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Good morning, John
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Here is what is happening today at{" "}
            <span className="font-semibold text-zinc-800">Kigali FC</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 bg-white border border-zinc-200 rounded-lg px-3 py-2 shadow-xs">
          <Calendar className="h-4 w-4 text-[#005F31]" />
          <span>Monday, September 7, 2026</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/players"
          className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-[#005F31]/30 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Players
            </span>
            <span className="rounded-lg bg-emerald-50 p-2 text-[#005F31] group-hover:bg-[#005F31] group-hover:text-white transition-colors">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900">248</span>
            <span className="text-xs font-medium text-[#005F31]">+12 this month</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">Active roster across 12 squads</p>
        </Link>

        <Link
          href="/dashboard/teams"
          className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-[#005F31]/30 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Teams
            </span>
            <span className="rounded-lg bg-emerald-50 p-2 text-[#005F31] group-hover:bg-[#005F31] group-hover:text-white transition-colors">
              <Shield className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900">12</span>
            <span className="text-xs font-medium text-zinc-500">Junior to Senior</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">Academy & Senior divisions</p>
        </Link>

        <Link
          href="/dashboard/training"
          className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-[#005F31]/30 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Training
            </span>
            <span className="rounded-lg bg-emerald-50 p-2 text-[#005F31] group-hover:bg-[#005F31] group-hover:text-white transition-colors">
              <Dumbbell className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900">4</span>
            <span className="text-xs font-medium text-[#005F31]">Today: 2 sessions</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">Scheduled for this week</p>
        </Link>

        <Link
          href="/dashboard/matches"
          className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-[#005F31]/30 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Matches
            </span>
            <span className="rounded-lg bg-emerald-50 p-2 text-[#005F31] group-hover:bg-[#005F31] group-hover:text-white transition-colors">
              <Trophy className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-zinc-900">2</span>
            <span className="text-xs font-medium text-purple-600">Saturday kickoff</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">National League fixtures</p>
        </Link>
      </div>

      {/* Main Schedule & Activity Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Training & Upcoming Match */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-900">Upcoming Highlights</h2>
            <Link
              href="/dashboard/training"
              className="text-xs font-semibold text-[#005F31] hover:underline flex items-center gap-1"
            >
              Full schedule <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Training Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-[#005F31]">
                  Today’s Training
                </span>
                <span className="text-xs text-zinc-400">Senior Team</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Tactical Preparation & Set Pieces
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Coach Emmanuel Mugisha • Focus on defensive transition
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-zinc-400" />
                  <span>18:00 - 19:30</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Pitch A (Main)</span>
                </div>
              </div>
            </div>

            {/* Upcoming Match Card */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700">
                  Upcoming Match
                </span>
                <span className="text-xs text-zinc-400">Matchday 14</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Kigali FC <span className="text-zinc-400 font-normal">vs</span> APR FC
                </h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Rwanda Premier League • Amahoro Stadium
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Saturday, 15:00</span>
                </div>
                <Link
                  href="/dashboard/matches"
                  className="font-medium text-[#005F31] hover:underline"
                >
                  View squad
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs">
            <h2 className="text-sm font-bold text-zinc-900">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/dashboard/players"
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-zinc-200 hover:border-[#005F31] hover:bg-emerald-50/40 transition-colors text-center group"
              >
                <Plus className="h-4 w-4 text-zinc-500 group-hover:text-[#005F31] mb-1" />
                <span className="text-xs font-medium text-zinc-700 group-hover:text-[#005F31]">
                  Add Player
                </span>
              </Link>
              <Link
                href="/dashboard/training"
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-zinc-200 hover:border-[#005F31] hover:bg-emerald-50/40 transition-colors text-center group"
              >
                <Dumbbell className="h-4 w-4 text-zinc-500 group-hover:text-[#005F31] mb-1" />
                <span className="text-xs font-medium text-zinc-700 group-hover:text-[#005F31]">
                  New Training
                </span>
              </Link>
              <Link
                href="/dashboard/matches"
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-zinc-200 hover:border-[#005F31] hover:bg-emerald-50/40 transition-colors text-center group"
              >
                <Trophy className="h-4 w-4 text-zinc-500 group-hover:text-[#005F31] mb-1" />
                <span className="text-xs font-medium text-zinc-700 group-hover:text-[#005F31]">
                  Schedule Match
                </span>
              </Link>
              <Link
                href="/dashboard/members"
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-zinc-200 hover:border-[#005F31] hover:bg-emerald-50/40 transition-colors text-center group"
              >
                <UserPlus className="h-4 w-4 text-zinc-500 group-hover:text-[#005F31] mb-1" />
                <span className="text-xs font-medium text-zinc-700 group-hover:text-[#005F31]">
                  Invite Member
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#005F31]" />
              Recent Activity
            </h2>
            <Link
              href="/dashboard/communication"
              className="text-xs text-zinc-400 hover:text-zinc-600"
            >
              See all
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-[#005F31] shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-zinc-800">
                  New player registered: Eric Kwizera
                </p>
                <p className="text-zinc-400 mt-0.5">Senior Team • 25m ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-zinc-800">
                  Medical report uploaded: U17 Squad
                </p>
                <p className="text-zinc-400 mt-0.5">By Dr. Patrick M. • 2h ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-zinc-800">
                  Attendance finalized: Tuesday Training
                </p>
                <p className="text-zinc-400 mt-0.5">92% attendance rate • 5h ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-purple-500 shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-zinc-800">
                  Match roster submitted: APR FC
                </p>
                <p className="text-zinc-400 mt-0.5">Approved by Head Coach • Yesterday</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-zinc-800">
                  Equipment order marked as delivered
                </p>
                <p className="text-zinc-400 mt-0.5">Kit manager • 2 days ago</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 text-center">
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#005F31] hover:underline"
            >
              <FileCheck className="h-3.5 w-3.5" />
              Generate weekly activity summary
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

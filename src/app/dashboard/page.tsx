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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Good morning, John
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here is what is happening today at{" "}
            <span className="font-semibold text-foreground">Kigali FC</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-card border border-border rounded-xl px-3.5 py-2 shadow-xs">
          <Calendar className="h-4 w-4 text-primary" />
          <span>Monday, September 7, 2026</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/players"
          className="group rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition-all text-card-foreground"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Players
            </span>
            <span className="rounded-xl bg-primary-subtle p-2 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors border border-primary/10">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">248</span>
            <span className="text-xs font-medium text-primary">+12 this month</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Active roster across 12 squads</p>
        </Link>

        <Link
          href="/dashboard/teams"
          className="group rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition-all text-card-foreground"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Teams
            </span>
            <span className="rounded-xl bg-primary-subtle p-2 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors border border-primary/10">
              <Shield className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">12</span>
            <span className="text-xs font-medium text-muted-foreground">Junior to Senior</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Academy & Senior divisions</p>
        </Link>

        <Link
          href="/dashboard/training"
          className="group rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition-all text-card-foreground"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Training
            </span>
            <span className="rounded-xl bg-primary-subtle p-2 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors border border-primary/10">
              <Dumbbell className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">4</span>
            <span className="text-xs font-medium text-primary">Today: 2 sessions</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Scheduled for this week</p>
        </Link>

        <Link
          href="/dashboard/matches"
          className="group rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition-all text-card-foreground"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Matches
            </span>
            <span className="rounded-xl bg-primary-subtle p-2 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors border border-primary/10">
              <Trophy className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">2</span>
            <span className="text-xs font-medium text-tertiary">Saturday kickoff</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">National League fixtures</p>
        </Link>
      </div>

      {/* Main Schedule & Activity Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Training & Upcoming Match */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Upcoming Highlights</h2>
            <Link
              href="/dashboard/training"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Full schedule <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Training Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 text-card-foreground">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-lg bg-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                  Today’s Training
                </span>
                <span className="text-xs text-muted-foreground">Senior Team</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Tactical Preparation & Set Pieces
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Coach Emmanuel Mugisha • Focus on defensive transition
                </p>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>18:00 - 19:30</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Pitch A (Main)</span>
                </div>
              </div>
            </div>

            {/* Upcoming Match Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 text-card-foreground">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-lg bg-tertiary px-2.5 py-0.5 text-xs font-semibold text-tertiary-foreground">
                  Upcoming Match
                </span>
                <span className="text-xs text-muted-foreground">Matchday 14</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Kigali FC <span className="text-muted-foreground font-normal">vs</span> APR FC
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Rwanda Premier League • Amahoro Stadium
                </p>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Saturday, 15:00</span>
                </div>
                <Link
                  href="/dashboard/matches"
                  className="font-semibold text-primary hover:underline"
                >
                  View squad
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs text-card-foreground">
            <h2 className="text-sm font-bold text-foreground">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/dashboard/players"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary-subtle transition-colors text-center group"
              >
                <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary mb-1" />
                <span className="text-xs font-medium text-foreground group-hover:text-primary">
                  Add Player
                </span>
              </Link>
              <Link
                href="/dashboard/training"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary-subtle transition-colors text-center group"
              >
                <Dumbbell className="h-4 w-4 text-muted-foreground group-hover:text-primary mb-1" />
                <span className="text-xs font-medium text-foreground group-hover:text-primary">
                  New Training
                </span>
              </Link>
              <Link
                href="/dashboard/matches"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary-subtle transition-colors text-center group"
              >
                <Trophy className="h-4 w-4 text-muted-foreground group-hover:text-primary mb-1" />
                <span className="text-xs font-medium text-foreground group-hover:text-primary">
                  Schedule Match
                </span>
              </Link>
              <Link
                href="/dashboard/members"
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary-subtle transition-colors text-center group"
              >
                <UserPlus className="h-4 w-4 text-muted-foreground group-hover:text-primary mb-1" />
                <span className="text-xs font-medium text-foreground group-hover:text-primary">
                  Invite Member
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Activity */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 text-card-foreground">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Recent Activity
            </h2>
            <Link
              href="/dashboard/communication"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              See all
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-foreground">
                  New player registered: Eric Kwizera
                </p>
                <p className="text-muted-foreground mt-0.5">Senior Team • 25m ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-info shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-foreground">
                  Medical report uploaded: U17 Squad
                </p>
                <p className="text-muted-foreground mt-0.5">By Dr. Patrick M. • 2h ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-warning shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-foreground">
                  Attendance finalized: Tuesday Training
                </p>
                <p className="text-muted-foreground mt-0.5">92% attendance rate • 5h ago</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-tertiary shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-foreground">
                  Match roster submitted: APR FC
                </p>
                <p className="text-muted-foreground mt-0.5">Approved by Head Coach • Yesterday</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-success shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-foreground">
                  Equipment order marked as delivered
                </p>
                <p className="text-muted-foreground mt-0.5">Kit manager • 2 days ago</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border text-center">
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
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

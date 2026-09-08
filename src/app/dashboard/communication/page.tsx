import {
  MessageSquare,
  Plus,
  Megaphone,
  Send,
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  author: string;
  target: string;
  date: string;
  preview: string;
  pinned?: boolean;
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Rwanda Premier League Matchday 14 Logistics — Amahoro Stadium",
    author: "Solange Umutoni (Operations)",
    target: "All Staff & Senior Squad",
    date: "Sep 7, 2026",
    preview:
      "Team bus departs the training ground at 12:45 sharp. Players must wear official travel tracksuits. Security passes will be handed out by team manager upon arrival.",
    pinned: true,
  },
  {
    id: "ann-2",
    title: "Under-17 Regional Cup Registration Deadline",
    author: "Dieudonné Habimana (Academy)",
    target: "U17 Coaches & Guardians",
    date: "Sep 5, 2026",
    preview:
      "All medical clearances and passport copies must be uploaded to the Documents portal before Friday 18:00 to complete FERWAFA registration.",
    pinned: false,
  },
  {
    id: "ann-3",
    title: "New Physiotherapy & Recovery Protocols",
    author: "Dr. Patrick Manzi (Medical)",
    target: "All Technical Staff",
    date: "Sep 2, 2026",
    preview:
      "Starting this week, ice bath recovery is mandatory for all players completing more than 60 minutes of training on high-intensity days.",
    pinned: false,
  },
];

export default function CommunicationPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Communication
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Broadcast club announcements, squad notices, and team messages.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#005F31] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#01562D] shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          New Announcement
        </button>
      </div>

      {/* Tabs / Sub-sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Official Announcements */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Megaphone className="h-3.5 w-3.5 text-[#005F31]" />
              Club Announcements
            </h2>
            <span className="text-xs text-zinc-400">3 active broadcasts</span>
          </div>

          <div className="space-y-3">
            {ANNOUNCEMENTS.map((ann) => (
              <div
                key={ann.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-zinc-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {ann.pinned && (
                      <span className="inline-block rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 mb-1">
                        PINNED ANNOUNCEMENT
                      </span>
                    )}
                    <h3 className="text-base font-bold text-zinc-900">
                      {ann.title}
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0">
                    {ann.date}
                  </span>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  {ann.preview}
                </p>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>From: {ann.author}</span>
                  <span className="rounded bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
                    To: {ann.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Team Chat / Direct Messaging Placeholder */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#005F31]" />
                Staff Direct Channels
              </h2>
              <span className="h-2 w-2 rounded-full bg-[#005F31]" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100/60">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#005F31] text-[10px] font-bold text-white">
                  TC
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-800">
                    Technical Coaches Group
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">
                    Coach Emmanuel: Updated lineup ready for review.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-50 border border-transparent transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-[10px] font-bold text-blue-800">
                  MD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-800">
                    Medical & Physio Desk
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Dr. Patrick: Kwizera ultrasound came back clear.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Send quick staff notice..."
                className="w-full h-9 rounded-lg border border-zinc-200 bg-zinc-50 pl-3 pr-9 text-xs text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#005F31]"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#005F31] hover:text-[#01562D]"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

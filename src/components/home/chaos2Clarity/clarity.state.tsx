'use client';

import React from 'react';

// ---------------------------------------------------------------------------
// ClarityState — the dashboard pane
//
// Structure:
//   outer wrapper   fills its parent (set by section to be below headline)
//   app-window pane centred, ~78vw × ~88%, max 68.75rem wide
//   browser chrome  fake URL bar
//   app nav         ClubSheet top bar
//   grid            12-col × 6-row dashboard panels
//
// Each panel has an outer box (empty shell, visible once pane appears) and
// an inner [data-slot-panel] div (opacity-0). GSAP fades the inner content
// in as the matching chaos card arrives and shrinks into the slot — creating
// the illusion the card BECOMES the panel.
//
// No px values — all sizing uses rem, %, or Tailwind scale units.
// Colors: only project tokens + zinc neutrals.
// ---------------------------------------------------------------------------

interface ClarityStateProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function ClarityState({ containerRef }: ClarityStateProps) {
  return (
    /* Fills parent, centres the pane, starts invisible */
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center pointer-events-none"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      {/* App-window pane: 78vw wide, 88% of parent height, max 68.75rem */}
      <div className="w-[78vw] h-[88%] max-w-[68.75rem] flex flex-col bg-white rounded-2xl shadow-[0_2rem_5rem_rgba(0,95,49,0.18)] border border-secondary overflow-hidden">

        {/* Browser chrome */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-secondary/40 border-b border-secondary shrink-0">
          <div className="flex gap-1.5 shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          </div>
          <div className="flex-1 bg-white/70 rounded px-3 py-1 text-[0.625rem] text-zinc-400 font-mono border border-secondary/60">
            app.clubsheet.io/dashboard
          </div>
        </div>

        {/* App shell */}
        <div className="flex-1 min-h-0 flex flex-col bg-quaternary overflow-hidden">

          {/* App top nav */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-secondary/60 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-primary" />
              <span className="font-bold text-primary text-xs tracking-tight">ClubSheet</span>
            </div>
            <nav className="flex items-center gap-5 text-[0.6875rem] text-zinc-500 font-medium">
              <span className="text-primary font-semibold border-b border-primary pb-0.5">Overview</span>
              <span>Players</span>
              <span>Training</span>
              <span>Matches</span>
            </nav>
            <div className="h-6 w-6 rounded-full bg-secondary" />
          </div>

          {/* 12-col × 6-row dashboard grid */}
          <div className="flex-1 min-h-0 grid grid-cols-12 grid-rows-6 gap-2.5 p-3 overflow-hidden">

            {/* ── Row 1: stat tiles ──────────────────────────────────── */}

            <div id="slot-playerCard" className="col-span-3 row-span-1 bg-white rounded-xl border border-secondary/60 shadow-sm overflow-hidden">
              <div data-slot-panel className="flex items-center gap-3 h-full px-3">
                <div className="h-8 w-8 rounded-lg bg-quinary flex-center shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase tracking-wider">Players</p>
                  <p className="text-xl font-bold text-zinc-900 leading-none">24</p>
                </div>
              </div>
            </div>

            <div id="slot-coachCard" className="col-span-3 row-span-1 bg-white rounded-xl border border-secondary/60 shadow-sm overflow-hidden">
              <div data-slot-panel className="flex items-center gap-3 h-full px-3">
                <div className="h-8 w-8 rounded-lg bg-quinary flex-center shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase tracking-wider">Coaches</p>
                  <p className="text-xl font-bold text-zinc-900 leading-none">6</p>
                </div>
              </div>
            </div>

            <div id="slot-trainingCard" className="col-span-3 row-span-1 bg-white rounded-xl border border-secondary/60 shadow-sm overflow-hidden">
              <div data-slot-panel className="flex items-center gap-3 h-full px-3">
                <div className="h-8 w-8 rounded-lg bg-quinary flex-center shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase tracking-wider">Sessions</p>
                  <p className="text-xl font-bold text-zinc-900 leading-none">3</p>
                </div>
              </div>
            </div>

            <div id="slot-calendar" className="col-span-3 row-span-1 bg-white rounded-xl border border-secondary/60 shadow-sm overflow-hidden">
              <div data-slot-panel className="flex items-center gap-3 h-full px-3">
                <div className="h-8 w-8 rounded-lg bg-quinary flex-center shrink-0">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase tracking-wider">Fixtures</p>
                  <p className="text-xl font-bold text-zinc-900 leading-none">4</p>
                </div>
              </div>
            </div>

            {/* ── Rows 2–4 ───────────────────────────────────────────── */}

            {/* Player roster */}
            <div id="slot-spreadsheet" className="col-span-7 row-span-3 bg-white rounded-xl border border-secondary/60 shadow-sm overflow-hidden">
              <div data-slot-panel className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-2 border-b border-secondary/40 shrink-0">
                  <h3 className="text-xs font-semibold text-zinc-800">Player Roster</h3>
                  <span className="text-[0.5625rem] bg-quinary text-primary font-mono font-bold px-2 py-0.5 rounded">U18 · 24 Players</span>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  <table className="w-full text-[0.625rem] font-mono">
                    <thead className="bg-quaternary border-b border-secondary/40">
                      <tr>
                        {['#', 'Name', 'Position', 'Status', 'Apps'].map((h) => (
                          <th key={h} className="px-3 py-1.5 text-left text-zinc-400 font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/30">
                      {[
                        { n: 10, name: 'Liam Davies',   pos: 'CAM', active: true,  apps: 14 },
                        { n: 1,  name: 'Alex Johnson',  pos: 'GK',  active: true,  apps: 12 },
                        { n: 5,  name: 'Daniel Wright', pos: 'CB',  active: true,  apps: 11 },
                        { n: 9,  name: 'Marcus Hill',   pos: 'ST',  active: false, apps: 8  },
                        { n: 7,  name: 'Owen Clarke',   pos: 'LW',  active: true,  apps: 13 },
                      ].map((p) => (
                        <tr key={p.n} className="hover:bg-quaternary transition-colors">
                          <td className="px-3 py-1.5 text-zinc-400">{p.n}</td>
                          <td className="px-3 py-1.5 font-semibold text-zinc-800">{p.name}</td>
                          <td className="px-3 py-1.5">
                            <span className="bg-secondary/50 text-zinc-600 px-1.5 py-0.5 rounded text-[0.5625rem] font-bold">{p.pos}</span>
                          </td>
                          <td className="px-3 py-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[0.5625rem] font-bold ${p.active ? 'bg-quinary text-primary' : 'bg-secondary text-zinc-500'}`}>
                              {p.active ? 'Active' : 'Injured'}
                            </span>
                          </td>
                          <td className="px-3 py-1.5 text-zinc-500">{p.apps}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Upcoming training */}
            <div id="slot-groupChat" className="col-span-5 row-span-2 bg-white rounded-xl border border-secondary/60 shadow-sm overflow-hidden">
              <div data-slot-panel className="flex flex-col h-full">
                <div className="px-4 py-2 border-b border-secondary/40 shrink-0 flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-zinc-800">Upcoming Training</h3>
                  <span className="text-[0.5625rem] text-zinc-400 font-mono">This week</span>
                </div>
                <div className="flex-1 min-h-0 p-2.5 space-y-1.5">
                  {[
                    { team: 'U18',    time: 'Today · 18:00', pitch: 'Pitch A', att: '18/22' },
                    { team: 'U16',    time: 'Thu · 17:00',   pitch: 'Pitch B', att: '14/18' },
                    { team: 'Senior', time: 'Fri · 20:00',   pitch: 'Main',    att: '22/26' },
                  ].map((s) => (
                    <div key={s.team} className="flex items-center justify-between bg-quaternary rounded-lg px-3 py-1.5 text-[0.625rem] font-mono">
                      <div>
                        <span className="font-bold text-zinc-800">{s.team}</span>
                        <span className="text-zinc-400 ml-2">{s.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400">{s.pitch}</span>
                        <span className="bg-quinary text-primary font-bold px-1.5 py-0.5 rounded">{s.att}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Access control */}
            <div id="slot-permission" className="col-span-5 row-span-1 bg-white rounded-xl border border-secondary/60 shadow-sm overflow-hidden">
              <div data-slot-panel className="flex items-center gap-3 h-full px-3">
                <div className="h-7 w-7 rounded-lg bg-quinary flex-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase tracking-wider">Roles &amp; Access</p>
                  <p className="text-xs font-semibold text-zinc-800">4 roles active across 3 teams</p>
                </div>
                <span className="text-[0.5625rem] bg-secondary text-zinc-600 font-mono font-bold px-2 py-1 rounded shrink-0">Manage</span>
              </div>
            </div>

            {/* ── Rows 5–6 ───────────────────────────────────────────── */}

            {/* Recent activity */}
            <div id="slot-notification" className="col-span-5 row-span-2 bg-white rounded-xl border border-secondary/60 shadow-sm overflow-hidden">
              <div data-slot-panel className="flex flex-col h-full">
                <div className="px-4 py-2 border-b border-secondary/40 shrink-0 flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-zinc-800">Recent Activity</h3>
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
                <div className="flex-1 min-h-0 p-2.5 space-y-1.5">
                  {[
                    { text: 'Liam Davies added to U18 Squad',     time: '2m ago'  },
                    { text: 'Training session updated — Pitch B', time: '15m ago' },
                    { text: 'Marcus Hill marked as unavailable',  time: '1h ago'  },
                    { text: 'Consent form signed — Alex Johnson', time: '2h ago'  },
                  ].map((a, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[0.625rem] font-sans">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-zinc-700 truncate">{a.text}</p>
                        <p className="text-zinc-400 font-mono">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents */}
            <div id="slot-documents" className="col-span-3 row-span-2 bg-white rounded-xl border border-secondary/60 shadow-sm overflow-hidden">
              <div data-slot-panel className="flex flex-col h-full">
                <div className="px-4 py-2 border-b border-secondary/40 shrink-0">
                  <h3 className="text-xs font-semibold text-zinc-800">Documents</h3>
                </div>
                <div className="flex-1 min-h-0 p-2.5 space-y-1.5">
                  {[
                    { name: 'Code of Conduct',  signed: true  },
                    { name: 'Consent Form v2',  signed: false },
                    { name: 'Player Registration', signed: true  },
                  ].map((d) => (
                    <div key={d.name} className="flex items-center justify-between bg-quaternary rounded px-2 py-1.5 text-[0.59375rem] font-mono">
                      <span className="truncate text-zinc-700 mr-2">{d.name}</span>
                      <span className={`font-bold shrink-0 ${d.signed ? 'text-primary' : 'text-zinc-400'}`}>
                        {d.signed ? 'SIGNED' : 'PENDING'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Finance */}
            <div id="slot-financial" className="col-span-2 row-span-2 bg-white rounded-xl border border-secondary/60 shadow-sm overflow-hidden">
              <div data-slot-panel className="flex flex-col h-full">
                <div className="px-3 py-2 border-b border-secondary/40 shrink-0">
                  <h3 className="text-xs font-semibold text-zinc-800">Finance</h3>
                </div>
                <div className="flex-1 min-h-0 p-3 flex flex-col justify-between">
                  <div>
                    <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase">Outstanding</p>
                    <p className="text-lg font-bold text-zinc-900 leading-tight">$1,450</p>
                  </div>
                  <div className="space-y-1 text-[0.5625rem] font-mono">
                    <div className="flex justify-between text-zinc-500">
                      <span>Collected</span>
                      <span className="font-bold text-primary">82%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-[82%] bg-primary rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical */}
            <div id="slot-medical" className="col-span-2 row-span-1 bg-quinary rounded-xl border border-secondary/60 shadow-sm overflow-hidden">
              <div data-slot-panel className="flex items-center gap-2 h-full px-3">
                <div className="h-7 w-7 rounded-lg bg-secondary flex-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase">Medical</p>
                  <p className="text-[0.625rem] font-bold text-zinc-800">1 player out</p>
                </div>
              </div>
            </div>

            {/* Kit */}
            <div id="slot-kitEquipment" className="col-span-2 row-span-1 bg-white rounded-xl border border-secondary/60 shadow-sm overflow-hidden">
              <div data-slot-panel className="flex items-center gap-2 h-full px-3">
                <div className="h-7 w-7 rounded-lg bg-quinary flex-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase">Kit</p>
                  <p className="text-[0.625rem] font-bold text-zinc-800">22/22 ready</p>
                </div>
              </div>
            </div>

            {/* Hidden anchor for actionTasks */}
            <div id="slot-actionTasks" className="absolute opacity-0 pointer-events-none" aria-hidden="true">
              <div data-slot-panel />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ClarityState;

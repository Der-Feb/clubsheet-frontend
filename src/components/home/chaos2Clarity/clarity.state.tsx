'use client';

import React from 'react';

// ---------------------------------------------------------------------------
// ClarityState
//
// Exactly 13 panels — one per chaos card, no extras.
// Every id="slot-X" maps 1:1 to a chaos card id.
//
// Grid: 12 columns × 6 rows
//
//  Row 1:    playerCard(3)  coachCard(3)   trainingCard(3) calendar(3)
//  Row 2-4:  spreadsheet(7×3)  groupChat(5×2)  permission(5×1)
//  Row 5:    notification(3)  documents(3)  financial(3)  medical(3)
//  Row 6:    actionTasks(6)  kitEquipment(6)
//
// Each slot is a transparent container. The [data-slot-panel] inside holds
// the actual dashboard content and starts at opacity:0. GSAP fades it in
// as the matching chaos card lands on the slot — the card morphs into it.
//
// The window chrome (chromeRef) fades in around the cards as they converge.
// Colors: project tokens + zinc only. No px values.
// ---------------------------------------------------------------------------

interface ClarityStateProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  chromeRef:    React.RefObject<HTMLDivElement | null>;
}

// Shared slot wrapper — transparent shell, just for positioning
function Slot({ id, className, children }: { id: string; className: string; children: React.ReactNode }) {
  return (
    <div id={id} className={`rounded-xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

// Shared panel inner — starts invisible, GSAP fades it in
function Panel({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      data-slot-panel
      className={`h-full w-full bg-white border border-secondary/60 rounded-xl shadow-sm ${className}`}
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
}

export function ClarityState({ containerRef, chromeRef }: ClarityStateProps) {
  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center pointer-events-none"
      style={{ opacity: 0 }}
      aria-hidden="true"
    >
      {/* App window — chrome fades in separately via chromeRef */}
      <div
        ref={chromeRef}
        className="relative w-[82vw] h-[88%] max-w-275 flex flex-col rounded-2xl overflow-hidden"
        style={{ opacity: 0 }}
      >
        {/* Inset shadow ring — doesn't clip content */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_2rem_5rem_rgba(0,95,49,0.2)] border border-secondary pointer-events-none z-10" />

        {/* URL bar */}
        <div className="relative z-20 flex items-center gap-3 px-4 py-2.5 bg-secondary/40 border-b border-secondary shrink-0">
          <div className="flex gap-1.5 shrink-0">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
          </div>
          <div className="flex-1 bg-white/70 rounded px-3 py-1 text-[0.625rem] text-zinc-400 font-mono border border-secondary/60">
            app.clubsheet.io/overview
          </div>
        </div>

        {/* App nav */}
        <div className="relative z-20 flex items-center justify-between px-5 py-2 border-b border-secondary/60 bg-white shrink-0">
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

        {/* Dashboard grid */}
        <div className="relative z-20 flex-1 min-h-0 grid grid-cols-12 grid-rows-6 gap-2 p-3 bg-quaternary overflow-hidden">

          {/* ── Row 1: stat tiles ──────────────────────────────────────── */}

          <Slot id="slot-playerCard" className="col-span-3 row-span-1">
            <Panel className="flex items-center gap-3 px-3">
              <div className="h-8 w-8 rounded-lg bg-quinary flex-center shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase tracking-wider">Players</p>
                <p className="text-xl font-bold text-zinc-900 leading-none">24</p>
              </div>
            </Panel>
          </Slot>

          <Slot id="slot-coachCard" className="col-span-3 row-span-1">
            <Panel className="flex items-center gap-3 px-3">
              <div className="h-8 w-8 rounded-lg bg-quinary flex-center shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase tracking-wider">Coaches</p>
                <p className="text-xl font-bold text-zinc-900 leading-none">6</p>
              </div>
            </Panel>
          </Slot>

          <Slot id="slot-trainingCard" className="col-span-3 row-span-1">
            <Panel className="flex items-center gap-3 px-3">
              <div className="h-8 w-8 rounded-lg bg-quinary flex-center shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase tracking-wider">Sessions</p>
                <p className="text-xl font-bold text-zinc-900 leading-none">3</p>
              </div>
            </Panel>
          </Slot>

          <Slot id="slot-calendar" className="col-span-3 row-span-1">
            <Panel className="flex items-center gap-3 px-3">
              <div className="h-8 w-8 rounded-lg bg-quinary flex-center shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase tracking-wider">Fixtures</p>
                <p className="text-xl font-bold text-zinc-900 leading-none">4</p>
              </div>
            </Panel>
          </Slot>

          {/* ── Rows 2–4 ───────────────────────────────────────────────── */}

          {/* spreadsheet → Player Roster table */}
          <Slot id="slot-spreadsheet" className="col-span-7 row-span-3">
            <Panel className="flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-secondary/40 shrink-0">
                <h3 className="text-xs font-semibold text-zinc-800">Player Roster</h3>
                <span className="text-[0.5625rem] bg-quinary text-primary font-mono font-bold px-2 py-0.5 rounded">U18 · 24</span>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <table className="w-full text-[0.625rem] font-mono">
                  <thead className="bg-quaternary border-b border-secondary/40">
                    <tr>
                      {['#', 'Name', 'Pos', 'Status', 'Apps'].map((h) => (
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
                          <span className="bg-secondary/50 text-zinc-600 px-1.5 py-0.5 rounded text-[0.5rem] font-bold">{p.pos}</span>
                        </td>
                        <td className="px-3 py-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[0.5rem] font-bold ${p.active ? 'bg-quinary text-primary' : 'bg-secondary text-zinc-500'}`}>
                            {p.active ? 'Active' : 'Injured'}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 text-zinc-500">{p.apps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </Slot>

          {/* groupChat → Upcoming Training */}
          <Slot id="slot-groupChat" className="col-span-5 row-span-2">
            <Panel className="flex flex-col">
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
            </Panel>
          </Slot>

          {/* permission → Roles & Access */}
          <Slot id="slot-permission" className="col-span-5 row-span-1">
            <Panel className="flex items-center gap-3 px-3">
              <div className="h-7 w-7 rounded-lg bg-quinary flex-center shrink-0">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase tracking-wider">Roles &amp; Access</p>
                <p className="text-xs font-semibold text-zinc-800">4 roles · 3 teams</p>
              </div>
              <span className="text-[0.5625rem] bg-secondary text-zinc-600 font-mono font-bold px-2 py-1 rounded shrink-0">Manage</span>
            </Panel>
          </Slot>

          {/* ── Row 5 ──────────────────────────────────────────────────── */}

          {/* notification → Club Alert */}
          <Slot id="slot-notification" className="col-span-3 row-span-1">
            <Panel className="flex flex-col justify-between p-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                <span className="text-[0.5625rem] font-mono font-bold text-primary uppercase tracking-wider">Club Alert</span>
              </div>
              <p className="text-[0.625rem] text-zinc-700 leading-snug">Pitch 2 unavailable — move to Field B.</p>
              <span className="text-[0.5rem] font-mono text-zinc-400">2 mins ago</span>
            </Panel>
          </Slot>

          {/* documents → Club Documents */}
          <Slot id="slot-documents" className="col-span-3 row-span-1">
            <Panel className="flex flex-col justify-between p-2.5">
              <p className="text-[0.5625rem] font-mono font-bold text-zinc-500 uppercase tracking-wider">Documents</p>
              <div className="space-y-1">
                {[
                  { name: 'Code of Conduct', signed: true  },
                  { name: 'Consent Form v2', signed: false },
                ].map((d) => (
                  <div key={d.name} className="flex items-center justify-between bg-quaternary rounded px-2 py-1 text-[0.5625rem] font-mono">
                    <span className="truncate text-zinc-700 mr-1">{d.name}</span>
                    <span className={`font-bold shrink-0 ${d.signed ? 'text-primary' : 'text-zinc-400'}`}>
                      {d.signed ? 'SIGNED' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </Slot>

          {/* financial → Membership Fees */}
          <Slot id="slot-financial" className="col-span-3 row-span-1">
            <Panel className="flex flex-col justify-between p-2.5">
              <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase">Fees</p>
              <p className="text-lg font-bold text-zinc-900 leading-tight">$1,450</p>
              <div className="space-y-1 text-[0.5625rem] font-mono">
                <div className="flex justify-between text-zinc-500">
                  <span>Collected</span>
                  <span className="font-bold text-primary">82%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[82%] bg-primary rounded-full" />
                </div>
              </div>
            </Panel>
          </Slot>

          {/* medical → Player Health */}
          <Slot id="slot-medical" className="col-span-3 row-span-1">
            <Panel className="flex items-center gap-2 px-3 bg-quinary border-secondary/60">
              <div className="h-7 w-7 rounded-lg bg-secondary flex-center shrink-0">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase">Medical</p>
                <p className="text-[0.625rem] font-bold text-zinc-800">1 player out</p>
              </div>
            </Panel>
          </Slot>

          {/* ── Row 6 ──────────────────────────────────────────────────── */}

          {/* actionTasks → To-do */}
          <Slot id="slot-actionTasks" className="col-span-6 row-span-1">
            <Panel className="flex items-center gap-3 px-3">
              <p className="text-[0.5625rem] text-zinc-400 font-mono uppercase tracking-wider shrink-0">To Do</p>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {['Call parents', 'Update roster', 'Confirm pitch'].map((t) => (
                  <span key={t} className="text-[0.5625rem] font-sans bg-quaternary border border-secondary text-zinc-600 px-2 py-0.5 rounded truncate">
                    {t}
                  </span>
                ))}
              </div>
            </Panel>
          </Slot>

          {/* kitEquipment → Kit */}
          <Slot id="slot-kitEquipment" className="col-span-6 row-span-1">
            <Panel className="flex items-center gap-3 px-3">
              <div className="h-7 w-7 rounded-lg bg-quinary flex-center shrink-0">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="flex items-center gap-4 text-[0.625rem] font-mono flex-1 min-w-0">
                <div><span className="text-zinc-400">Match Shirts</span> <span className="font-bold text-primary ml-1">22/22</span></div>
                <div><span className="text-zinc-400">Cones</span> <span className="font-bold text-zinc-500 ml-1">2/4</span></div>
                <div><span className="text-zinc-400">Balls</span> <span className="font-bold text-primary ml-1">12/12</span></div>
              </div>
            </Panel>
          </Slot>

        </div>
      </div>
    </div>
  );
}

export default ClarityState;

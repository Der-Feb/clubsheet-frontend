'use client';

import React from 'react';

// ─── Shared card shell props ──────────────────────────────────────────────
interface CardProps {
  height?: string;
  className?: string;
}

// ─── Calendar ─────────────────────────────────────────────────────────────

type CalendarDay = {
  day: number;
  weekday: string;
  event?: string;
};

const days: CalendarDay[] = [
  { day: 10, weekday: 'M' },
  { day: 11, weekday: 'T' },
  { day: 12, weekday: 'W', event: 'vs Arsenal U18' },
  { day: 13, weekday: 'T' },
  { day: 14, weekday: 'F' },
  { day: 15, weekday: 'S' },
  { day: 16, weekday: 'S' },
  { day: 17, weekday: 'M' },
  { day: 18, weekday: 'T' },
  { day: 19, weekday: 'W' },
  { day: 20, weekday: 'T', event: 'Tactical Review' },
  { day: 21, weekday: 'F' },
  { day: 22, weekday: 'S', event: 'Cup Match' },
  { day: 23, weekday: 'S' },
];

export const Calendar: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`w-full max-w-xs font-mono bg-white rounded-lg border border-secondary shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1.5 shrink-0 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="font-semibold text-primary truncate">Club Schedule</span>
        <span className="rounded bg-secondary px-1 py-0.5 text-[8px] font-bold text-zinc-600 shrink-0">3 games</span>
      </div>
      <div className="flex gap-1 shrink-0">
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
      </div>
    </div>
    <div className="flex-1 min-h-0 p-2 flex flex-col justify-between overflow-hidden">
      <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-medium text-zinc-400 uppercase">
        {['M','T','W','T','F','S','S'].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-sans">
        {days.map((item, idx) => (
          <div
            key={idx}
            title={item.event}
            className={`relative flex items-center justify-center h-6 rounded ${
              item.event
                ? 'bg-quinary text-primary font-bold border border-secondary'
                : 'text-zinc-600 font-medium'
            }`}
          >
            <span>{item.day}</span>
            {item.event && (
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Group chat ────────────────────────────────────────────────────────────

const chatMessages = [
  { id: 1, sender: 'Coach Marcus', text: 'Kick-off moved to 3 PM — who has the kits?', time: '14:02', urgent: true },
  { id: 2, sender: 'Alex',         text: 'Left them in the shed, it\'s locked 😅',      time: '14:05', urgent: false },
  { id: 3, sender: 'Daniel',       text: 'Who has the key?? We start in 1 hr!',          time: '14:06', urgent: false },
];

export const GroupChat: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`w-full max-w-xs font-mono bg-white rounded-lg border border-secondary shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1.5 shrink-0 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="font-semibold text-primary truncate">Team Chat</span>
        <span className="rounded bg-primary text-white px-1 py-0.5 text-[8px] font-bold shrink-0 animate-pulse">12 new</span>
      </div>
      <div className="flex gap-1 shrink-0">
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
      </div>
    </div>
    <div className="flex-1 min-h-0 p-2 space-y-1.5 overflow-hidden flex flex-col justify-end font-sans text-[10px]">
      {chatMessages.map((msg) => (
        <div key={msg.id} className="flex items-start gap-1.5">
          <div className="h-4 w-4 rounded-full bg-primary text-white text-[7px] font-bold flex items-center justify-center shrink-0 mt-0.5">
            {msg.sender.charAt(0)}
          </div>
          <div className={`rounded-md p-1.5 leading-tight w-full ${msg.urgent ? 'bg-quinary border border-secondary' : 'bg-zinc-100'}`}>
            <div className="flex justify-between text-[8px] mb-0.5 font-mono">
              <span className="font-bold text-zinc-900 truncate">{msg.sender}</span>
              <span className="text-zinc-400 shrink-0 ml-1">{msg.time}</span>
            </div>
            <p className="truncate text-zinc-600">{msg.text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Player card ───────────────────────────────────────────────────────────

const playerStats = [
  { label: 'Games', value: 14 },
  { label: 'Goals', value: 9  },
  { label: 'Assists', value: 5  },
  { label: 'Fitness', value: '88%' },
];

export const PlayerCard: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`w-full max-w-xs font-mono bg-white rounded-lg border border-secondary shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1.5 shrink-0 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="font-semibold text-primary truncate">Player Profile</span>
        <span className="rounded bg-quinary border border-secondary px-1 py-0.5 text-[8px] font-bold text-primary shrink-0">Active</span>
      </div>
      <div className="flex gap-1 shrink-0">
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
      </div>
    </div>
    <div className="flex-1 min-h-0 p-2 flex flex-col justify-between overflow-hidden bg-white">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-primary text-white font-bold text-xs flex items-center justify-center shrink-0">
          #10
        </div>
        <div className="min-w-0 font-sans">
          <h4 className="font-bold text-zinc-900 text-xs truncate leading-tight">Liam Davies</h4>
          <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-mono mt-0.5">
            <span className="rounded bg-secondary px-1 font-bold text-zinc-700">CAM</span>
            <span className="truncate">• U18</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1 pt-1 border-t border-secondary text-center font-mono">
        {playerStats.map((s) => (
          <div key={s.label} className="bg-quinary rounded p-1 border border-secondary">
            <div className="text-[7px] text-zinc-400 uppercase">{s.label}</div>
            <div className="font-bold text-zinc-800 text-[10px]">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Spreadsheet ───────────────────────────────────────────────────────────

const rows = [
  { name: 'Alex',    age: 18, position: 'Goalkeeper', team: 'U18' },
  { name: 'Daniel',  age: 19, position: 'Defender',   team: 'U18' },
  { name: 'Michael', age: 20, position: 'Midfielder', team: 'U16' },
];

export const SpreadSheet: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`max-w-sm w-full rounded-lg border border-secondary bg-white font-mono shadow-sm overflow-hidden flex flex-col ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1 shrink-0 text-[9px] text-zinc-600">
      <span className="font-semibold text-primary truncate">Player List</span>
      <div className="flex gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
      </div>
    </div>
    <div className="overflow-auto flex-1">
      <table className="w-full border-collapse text-left text-[10px]">
        <thead className="sticky top-0 bg-quinary border-b border-secondary text-[9px] uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="border-r border-secondary px-2 py-0.5 w-5 text-center text-zinc-400">#</th>
            {['Name','Age','Position','Team'].map((h) => (
              <th key={h} className="border-r border-secondary px-2 py-0.5 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary/60 text-zinc-700">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-quinary transition-colors">
              <td className="border-r border-secondary px-2 py-0.5 text-center text-zinc-400 text-[8px]">{i+1}</td>
              <td className="border-r border-secondary px-2 py-0.5">{r.name}</td>
              <td className="border-r border-secondary px-2 py-0.5">{r.age}</td>
              <td className="border-r border-secondary px-2 py-0.5">{r.position}</td>
              <td className="border-r border-secondary px-2 py-0.5">{r.team}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Calendar;

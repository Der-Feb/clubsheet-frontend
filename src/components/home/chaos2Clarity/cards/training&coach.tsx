'use client';

import React from 'react';

interface CardProps {
  height?: string;
  className?: string;
}

// ─── Training session ──────────────────────────────────────────────────────

export const TrainingCard: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`w-full max-w-xs font-mono bg-white rounded-lg border border-secondary shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1.5 shrink-0 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="font-semibold text-primary truncate">Training Session</span>
        <span className="rounded bg-secondary px-1 py-0.5 text-[8px] font-bold text-zinc-600">17:00</span>
      </div>
      <div className="flex gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
      </div>
    </div>
    <div className="flex-1 min-h-0 p-2 flex flex-col justify-between font-sans">
      <div>
        <h4 className="font-bold text-zinc-900 text-xs">High-Press &amp; Tactical Drills</h4>
        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Pitch A · Main Turf</p>
      </div>
      <div className="grid grid-cols-2 gap-1 text-[9px] font-mono">
        <div className="bg-quinary border border-secondary p-1 rounded">
          <span className="text-zinc-400">Attending:</span>{' '}
          <span className="font-bold text-primary">18/22</span>
        </div>
        <div className="bg-quinary border border-secondary p-1 rounded">
          <span className="text-zinc-400">Focus:</span>{' '}
          <span className="font-bold text-zinc-800">Defending</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── Coach profile ─────────────────────────────────────────────────────────

export const CoachCard: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`w-full max-w-xs font-mono bg-white rounded-lg border border-secondary shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1.5 shrink-0 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-semibold text-primary truncate">Head Coach</span>
        <span className="rounded bg-secondary px-1 py-0.5 text-[8px] font-bold text-zinc-600">UEFA A</span>
      </div>
      <div className="flex gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
      </div>
    </div>
    <div className="flex-1 min-h-0 p-2 flex flex-col justify-between font-sans">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">MC</div>
        <div className="min-w-0">
          <h4 className="font-bold text-zinc-900 text-xs truncate">Marcus Carter</h4>
          <p className="text-[10px] text-zinc-500 font-mono">Head Coach · U18s</p>
        </div>
      </div>
      <div className="bg-quinary border border-secondary p-1.5 rounded text-[9.5px] font-mono flex justify-between">
        <span className="text-zinc-500">License expires:</span>
        <span className="font-bold text-zinc-800">NOV 2027</span>
      </div>
    </div>
  </div>
);

// ─── Notification / alert ──────────────────────────────────────────────────

export const NotificationCard: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`w-full max-w-xs font-mono bg-white rounded-lg border border-secondary shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1.5 shrink-0 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-primary shrink-0 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="font-semibold text-primary truncate">Club Alert</span>
        <span className="rounded bg-primary text-white px-1 py-0.5 text-[8px] font-bold">Urgent</span>
      </div>
      <div className="flex gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
      </div>
    </div>
    <div className="flex-1 min-h-0 p-2 flex flex-col justify-between font-sans">
      <div className="bg-quinary border border-secondary rounded p-1.5">
        <span className="text-[9px] font-mono font-bold text-primary block">Pitch 2 Unavailable</span>
        <p className="text-[10px] text-zinc-700 leading-tight">Waterlogging failed. Move match to Field B.</p>
      </div>
      <span className="text-[8.5px] font-mono text-zinc-400 text-right">2 mins ago</span>
    </div>
  </div>
);

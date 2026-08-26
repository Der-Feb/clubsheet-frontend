'use client';

import React from 'react';

interface CardProps {
  height?: string;
  className?: string;
}

// ─── Player health ─────────────────────────────────────────────────────────

export const MedicalRecordCard: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`w-full max-w-xs font-mono bg-white rounded-lg border border-secondary shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1.5 shrink-0 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="font-semibold text-primary truncate">Player Health</span>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
    </div>
    <div className="flex-1 min-h-0 p-2 flex flex-col justify-between font-sans">
      <div className="flex justify-between items-start">
        <div>
          <h5 className="font-bold text-xs text-zinc-900">David K.</h5>
          <p className="text-[9.5px] text-zinc-500 font-mono">Ankle Sprain (Grade 1)</p>
        </div>
        <span className="bg-secondary text-zinc-600 font-mono text-[8px] px-1 py-0.5 rounded font-bold">Out 2 wks</span>
      </div>
      <div className="text-[8.5px] font-mono text-zinc-500 bg-quinary p-1 rounded border border-secondary">
        Physio clearance required before match day.
      </div>
    </div>
  </div>
);

// ─── Kit inventory ─────────────────────────────────────────────────────────

export const KitEquipmentCard: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`w-full max-w-xs font-mono bg-white rounded-lg border border-secondary shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1.5 shrink-0 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span className="font-semibold text-primary truncate">Kit &amp; Equipment</span>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
    </div>
    <div className="flex-1 min-h-0 p-2 space-y-1 text-[9px]">
      <div className="flex justify-between p-1 bg-quinary rounded border border-secondary">
        <span className="text-zinc-600">Match Shirts</span>
        <span className="font-bold text-primary">22/22</span>
      </div>
      <div className="flex justify-between p-1 bg-quinary rounded border border-secondary">
        <span className="text-zinc-600">Training Cones</span>
        <span className="font-bold text-zinc-500">2/4</span>
      </div>
      <div className="flex justify-between p-1 bg-quinary rounded border border-secondary">
        <span className="text-zinc-600">Match Balls</span>
        <span className="font-bold text-primary">12/12</span>
      </div>
    </div>
  </div>
);

// ─── To-do tasks ───────────────────────────────────────────────────────────

export const ActionTasksCard: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`w-full max-w-xs font-mono bg-white rounded-lg border border-secondary shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1.5 shrink-0 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span className="font-semibold text-primary truncate">Things To Do</span>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
    </div>
    <div className="flex-1 min-h-0 p-2 space-y-1 font-sans text-[9.5px]">
      {[
        'Call parents (U18 away trip)',
        'Update matchday roster',
        'Confirm pitch booking',
      ].map((task) => (
        <label key={task} className="flex items-center gap-1.5 p-1 bg-quinary rounded border border-secondary cursor-pointer">
          <input type="checkbox" className="rounded accent-primary" />
          <span className="text-zinc-700 truncate">{task}</span>
        </label>
      ))}
    </div>
  </div>
);

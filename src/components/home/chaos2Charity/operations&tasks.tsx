'use client';

import React from 'react';

export interface ComponentProps {
  height?: string;
  maxWidth?: string;
  fontFamily?: string;
  bgColor?: string;
  className?: string;
}

export const MedicalRecordCard: React.FC<ComponentProps> = ({
  height = '8.5rem',
  maxWidth = 'max-w-xs',
  fontFamily = 'font-mono',
  bgColor = 'bg-white',
  className = '',
}) => (
  <div style={{ height }} className={`w-full ${maxWidth} ${fontFamily} ${bgColor} rounded-lg border border-zinc-200 shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}>
    <div className="flex items-center justify-between border-b border-zinc-200 bg-rose-50 px-2.5 py-1.5 shrink-0 text-xs text-rose-800">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span className="font-semibold text-rose-800 truncate">med_clearance</span>
      </div>
      <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-rose-300" /></div>
    </div>
    <div className="flex-1 min-h-0 p-2 flex flex-col justify-between font-sans">
      <div className="flex justify-between items-start">
        <div>
          <h5 className="font-bold text-xs text-zinc-900">David K.</h5>
          <p className="text-[9.5px] text-zinc-500 font-mono">Ankle Sprain (Grade 1)</p>
        </div>
        <span className="bg-rose-100 text-rose-700 font-mono text-[8px] px-1 py-0.5 rounded font-bold">OUT 2 WKS</span>
      </div>
      <div className="text-[8.5px] font-mono text-zinc-500 bg-zinc-50 p-1 rounded">Physio clearance required before match day.</div>
    </div>
  </div>
);

export const KitEquipmentCard: React.FC<ComponentProps> = ({
  height = '8.5rem',
  maxWidth = 'max-w-xs',
  fontFamily = 'font-mono',
  bgColor = 'bg-white',
  className = '',
}) => (
  <div style={{ height }} className={`w-full ${maxWidth} ${fontFamily} ${bgColor} rounded-lg border border-zinc-200 shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}>
    <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-100/80 px-2.5 py-1.5 shrink-0 text-xs text-zinc-600">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span className="font-semibold text-emerald-600 truncate">kit_inventory</span>
      </div>
      <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-zinc-300" /></div>
    </div>
    <div className="flex-1 min-h-0 p-2 space-y-1 font-mono text-[9px]">
      <div className="flex justify-between p-1 bg-zinc-50 rounded"><span className="text-zinc-600">Home Match Shirts</span><span className="font-bold text-emerald-600">22/22</span></div>
      <div className="flex justify-between p-1 bg-zinc-50 rounded"><span className="text-zinc-600">Training Cone Sets</span><span className="font-bold text-amber-600">2/4</span></div>
      <div className="flex justify-between p-1 bg-zinc-50 rounded"><span className="text-zinc-600">Match Balls (Size 5)</span><span className="font-bold text-emerald-600">12/12</span></div>
    </div>
  </div>
);

export const ActionTasksCard: React.FC<ComponentProps> = ({
  height = '8.5rem',
  maxWidth = 'max-w-xs',
  fontFamily = 'font-mono',
  bgColor = 'bg-white',
  className = '',
}) => (
  <div style={{ height }} className={`w-full ${maxWidth} ${fontFamily} ${bgColor} rounded-lg border border-zinc-200 shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}>
    <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-100/80 px-2.5 py-1.5 shrink-0 text-xs text-zinc-600">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span className="font-semibold text-emerald-600 truncate">pending_tasks</span>
      </div>
      <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-zinc-300" /></div>
    </div>
    <div className="flex-1 min-h-0 p-2 space-y-1 font-sans text-[9.5px]">
      <label className="flex items-center gap-1.5 p-1 bg-zinc-50 rounded cursor-pointer">
        <input type="checkbox" className="rounded text-emerald-600 accent-emerald-600" />
        <span className="text-zinc-700 truncate">Call parents (U18 away trip)</span>
      </label>
      <label className="flex items-center gap-1.5 p-1 bg-zinc-50 rounded cursor-pointer">
        <input type="checkbox" className="rounded text-emerald-600 accent-emerald-600" />
        <span className="text-zinc-700 truncate">Update matchday roster</span>
      </label>
      <label className="flex items-center gap-1.5 p-1 bg-zinc-50 rounded cursor-pointer">
        <input type="checkbox" className="rounded text-emerald-600 accent-emerald-600" />
        <span className="text-zinc-700 truncate">Confirm pitch booking</span>
      </label>
    </div>
  </div>
);
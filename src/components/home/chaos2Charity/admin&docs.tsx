'use client';

import React from 'react';

export interface ComponentProps {
  height?: string;
  maxWidth?: string;
  fontFamily?: string;
  bgColor?: string;
  className?: string;
}

export const DocumentsCard: React.FC<ComponentProps> = ({
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="font-semibold text-emerald-600 truncate">club_docs.pdf</span>
      </div>
      <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-zinc-300" /></div>
    </div>
    <div className="flex-1 min-h-0 p-2 space-y-1 font-mono text-[9.5px]">
      <div className="flex items-center justify-between bg-zinc-50 p-1.5 rounded border border-zinc-100">
        <span className="truncate text-zinc-700">Code_of_Conduct.pdf</span>
        <span className="text-[8px] text-emerald-600 font-bold">SIGNED</span>
      </div>
      <div className="flex items-center justify-between bg-zinc-50 p-1.5 rounded border border-zinc-100">
        <span className="truncate text-zinc-700">Consent_Form_v2.pdf</span>
        <span className="text-[8px] text-amber-600 font-bold">PENDING</span>
      </div>
    </div>
  </div>
);

export const PermissionCard: React.FC<ComponentProps> = ({
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="font-semibold text-emerald-600 truncate">access_control</span>
      </div>
      <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-zinc-300" /></div>
    </div>
    <div className="flex-1 min-h-0 p-2 flex flex-col justify-between font-mono text-[9.5px]">
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">Role: Coach Admin</span>
        <span className="bg-emerald-100 text-emerald-700 font-bold px-1 rounded text-[8px]">LEVEL 3</span>
      </div>
      <div className="space-y-1 text-[8.5px]">
        <div className="flex justify-between text-zinc-500"><span>Roster Edit</span><span className="text-emerald-600">Allowed</span></div>
        <div className="flex justify-between text-zinc-500"><span>Finance Export</span><span className="text-rose-500">Locked</span></div>
      </div>
    </div>
  </div>
);

export const FinancialCard: React.FC<ComponentProps> = ({
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-semibold text-emerald-600 truncate">fee_ledger.csv</span>
      </div>
      <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-zinc-300" /></div>
    </div>
    <div className="flex-1 min-h-0 p-2 flex flex-col justify-between font-mono">
      <div>
        <div className="text-[9px] text-zinc-400">Monthly Subs Outstanding</div>
        <div className="text-base font-bold text-zinc-900">$1,450.00</div>
      </div>
      <div className="flex justify-between items-center text-[8.5px] bg-emerald-50 text-emerald-800 p-1 rounded border border-emerald-200">
        <span>Collected: 82%</span>
        <span className="font-bold">14/18 Paid</span>
      </div>
    </div>
  </div>
);
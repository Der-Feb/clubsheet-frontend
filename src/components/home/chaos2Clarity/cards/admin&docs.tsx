'use client';

import React from 'react';

interface CardProps {
  height?: string;
  className?: string;
}

// ─── Club documents ────────────────────────────────────────────────────────

export const DocumentsCard: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`w-full max-w-xs font-mono bg-white rounded-lg border border-secondary shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1.5 shrink-0 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="font-semibold text-primary truncate">Club Documents</span>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
    </div>
    <div className="flex-1 min-h-0 p-2 space-y-1 text-[9.5px]">
      <div className="flex items-center justify-between bg-quinary p-1.5 rounded border border-secondary">
        <span className="truncate text-zinc-700">Code of Conduct</span>
        <span className="text-[8px] text-primary font-bold shrink-0 ml-1">SIGNED</span>
      </div>
      <div className="flex items-center justify-between bg-quinary p-1.5 rounded border border-secondary">
        <span className="truncate text-zinc-700">Consent Form v2</span>
        <span className="text-[8px] text-zinc-400 font-bold shrink-0 ml-1">PENDING</span>
      </div>
    </div>
  </div>
);

// ─── Roles & access ────────────────────────────────────────────────────────

export const PermissionCard: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`w-full max-w-xs font-mono bg-white rounded-lg border border-secondary shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1.5 shrink-0 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span className="font-semibold text-primary truncate">Roles &amp; Access</span>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
    </div>
    <div className="flex-1 min-h-0 p-2 flex flex-col justify-between text-[9.5px]">
      <div className="flex items-center justify-between">
        <span className="text-zinc-600">Coach Admin</span>
        <span className="bg-quinary text-primary font-bold px-1 rounded text-[8px] border border-secondary">Level 3</span>
      </div>
      <div className="space-y-1 text-[8.5px]">
        <div className="flex justify-between text-zinc-500">
          <span>Edit roster</span>
          <span className="text-primary font-bold">Allowed</span>
        </div>
        <div className="flex justify-between text-zinc-500">
          <span>Export finances</span>
          <span className="text-zinc-400 font-bold">Locked</span>
        </div>
      </div>
    </div>
  </div>
);

// ─── Membership fees ───────────────────────────────────────────────────────

export const FinancialCard: React.FC<CardProps> = ({ height = '8.5rem', className = '' }) => (
  <div
    style={{ height }}
    className={`w-full max-w-xs font-mono bg-white rounded-lg border border-secondary shadow-sm flex flex-col overflow-hidden shrink-0 ${className}`}
  >
    <div className="flex items-center justify-between border-b border-secondary bg-quinary px-2.5 py-1.5 shrink-0 text-xs">
      <div className="flex items-center gap-1.5 min-w-0">
        <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-semibold text-primary truncate">Membership Fees</span>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
    </div>
    <div className="flex-1 min-h-0 p-2 flex flex-col justify-between">
      <div>
        <div className="text-[9px] text-zinc-400">Monthly subs outstanding</div>
        <div className="text-base font-bold text-zinc-900">$1,450.00</div>
      </div>
      <div className="flex justify-between items-center text-[8.5px] bg-quinary p-1 rounded border border-secondary">
        <span className="text-zinc-600">Collected: 82%</span>
        <span className="font-bold text-primary">14/18 paid</span>
      </div>
    </div>
  </div>
);

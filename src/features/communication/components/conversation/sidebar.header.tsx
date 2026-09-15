'use client';

import Link from 'next/link';
import { Search, Plus, ArrowLeft } from 'lucide-react';

export interface SidebarHeaderProps {
  onOpenSearch: () => void;
  onOpenCreateGroup: () => void;
}

export function SidebarHeader({ onOpenSearch, onOpenCreateGroup }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-border bg-card">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          title="Back to Dashboard"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-lg font-bold text-foreground tracking-tight">Chat</h1>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search messages"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onOpenCreateGroup}
          aria-label="Create group"
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

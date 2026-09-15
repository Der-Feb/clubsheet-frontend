'use client';

import { Search, Info, ArrowLeft } from 'lucide-react';
import { useCommunication } from '../../context/communication.context';

export interface HeaderActionsProps {
  onToggleSearch: () => void;
  onToggleDetails: () => void;
}

export function HeaderActions({ onToggleSearch, onToggleDetails }: HeaderActionsProps) {
  const { setMobileView } = useCommunication();

  return (
    <div className="flex items-center gap-1">
      {/* Mobile Back Button */}
      <button
        type="button"
        onClick={() => setMobileView('list')}
        aria-label="Back to conversations"
        className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Search Toggle */}
      <button
        type="button"
        onClick={onToggleSearch}
        aria-label="Search in conversation"
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Details Panel Toggle */}
      <button
        type="button"
        onClick={onToggleDetails}
        aria-label="Group info and settings"
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
      >
        <Info className="w-4 h-4" />
      </button>
    </div>
  );
}

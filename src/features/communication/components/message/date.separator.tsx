'use client';

import { format, isToday, isYesterday } from 'date-fns';

export interface DateSeparatorProps {
  dateIso: string;
}

function formatDateLabel(dateIso: string): string {
  const date = new Date(dateIso);
  if (isNaN(date.getTime())) return '';

  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function DateSeparator({ dateIso }: DateSeparatorProps) {
  const label = formatDateLabel(dateIso);
  if (!label) return null;

  return (
    <div className="my-4 flex items-center justify-center">
      <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border/50">
        {label}
      </div>
    </div>
  );
}

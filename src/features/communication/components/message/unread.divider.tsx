'use client';

export interface UnreadDividerProps {
  count?: number;
}

export function UnreadDivider({ count }: UnreadDividerProps) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="flex-1 h-px bg-danger/40" />
      <span className="px-2.5 py-0.5 rounded-full bg-danger/10 text-danger text-xs font-semibold uppercase tracking-wider">
        {count ? `${count} Unread Message${count > 1 ? 's' : ''}` : 'Unread Messages'}
      </span>
      <div className="flex-1 h-px bg-danger/40" />
    </div>
  );
}

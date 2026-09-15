'use client';

import { Info } from 'lucide-react';

export interface SystemMessageProps {
  content: string;
}

export function SystemMessage({ content }: SystemMessageProps) {
  return (
    <div className="my-2 flex items-center justify-center">
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/60 text-muted-foreground text-xs font-normal">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>{content}</span>
      </div>
    </div>
  );
}

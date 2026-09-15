'use client';

import { FileText } from 'lucide-react';
import type { Message } from '../../types/communication.types';

export interface FilesSectionProps {
  messages: Message[];
}

export function FilesSection({ messages }: FilesSectionProps) {
  const fileAttachments = messages.filter(m => !m.isDeleted).flatMap(m =>
    m.attachments.filter(
      a => !a.mimeType.startsWith('image/') && !a.mimeType.startsWith('video/')
    )
  );

  if (fileAttachments.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-muted-foreground">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
        No files shared in this group yet
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {fileAttachments.map(file => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <FileText className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{file.fileName}</p>
            <p className="text-[10px] text-muted-foreground">
              {(file.fileSize / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

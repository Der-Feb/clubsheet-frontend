'use client';

import { Bell, BellOff, AtSign } from 'lucide-react';
import type { NotificationPreference } from '../../types/communication.types';

export interface NotificationSettingsProps {
  preference: NotificationPreference;
  onUpdatePreference: (pref: NotificationPreference, mutedUntil?: string) => void;
}

export function NotificationSettings({
  preference,
  onUpdatePreference,
}: NotificationSettingsProps) {
  const options: { value: NotificationPreference; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      value: 'ALL',
      label: 'All Messages',
      desc: 'Get notified for every message sent to this group.',
      icon: Bell,
    },
    {
      value: 'MENTIONS_ONLY',
      label: 'Mentions Only',
      desc: 'Get notified only when @mentioned or replied to.',
      icon: AtSign,
    },
    {
      value: 'MUTED',
      label: 'Muted',
      desc: 'No push notifications for messages in this group.',
      icon: BellOff,
    },
  ];

  return (
    <div className="p-4 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Notification Settings
      </h4>

      <div className="space-y-2">
        {options.map(opt => {
          const IconComponent = opt.icon;
          const isSelected = preference === opt.value;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onUpdatePreference(opt.value)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
              }`}
            >
              <IconComponent
                className={`w-4 h-4 mt-0.5 shrink-0 ${
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground">{opt.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">
                  {opt.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

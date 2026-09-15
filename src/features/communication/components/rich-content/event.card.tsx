'use client';

import { Calendar, MapPin, Check, HelpCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { useIsHydrated } from '@/hooks/use-is-hydrated.hook';
import type { EventData, EventResponse } from '../../types/communication.types';

export interface EventCardProps {
  eventData: EventData;
  messageId: string;
  conversationId: string;
  currentUserId: string;
  onRespond: (conversationId: string, messageId: string, response: EventResponse) => void;
}

export function EventCard({
  eventData,
  messageId,
  conversationId,
  currentUserId,
  onRespond,
}: EventCardProps) {
  const isHydrated = useIsHydrated();
  const eventDate = new Date(eventData.date);
  const formattedDate = !isHydrated || isNaN(eventDate.getTime())
    ? eventData.date
    : format(eventDate, 'EEEE, MMMM d, yyyy • h:mm a');

  const currentResponse = eventData.responses[currentUserId];

  const goingCount = Object.values(eventData.responses).filter(r => r === 'GOING').length;
  const maybeCount = Object.values(eventData.responses).filter(r => r === 'MAYBE').length;

  return (
    <div className="w-full my-2 p-4 rounded-xl bg-card border border-border text-card-foreground shadow-xs">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-foreground truncate">{eventData.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{formattedDate}</p>
          {eventData.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{eventData.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {eventData.description && (
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          {eventData.description}
        </p>
      )}

      {/* Responses Summary */}
      <div className="text-xs text-muted-foreground mb-3">
        <span>{goingCount} Going</span>
        {maybeCount > 0 && <span> • {maybeCount} Maybe</span>}
      </div>

      {/* Response Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onRespond(conversationId, messageId, 'GOING')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            currentResponse === 'GOING'
              ? 'bg-success text-success-foreground'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>Going</span>
        </button>

        <button
          type="button"
          onClick={() => onRespond(conversationId, messageId, 'MAYBE')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            currentResponse === 'MAYBE'
              ? 'bg-warning text-warning-foreground'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Maybe</span>
        </button>

        <button
          type="button"
          onClick={() => onRespond(conversationId, messageId, 'CANT_GO')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            currentResponse === 'CANT_GO'
              ? 'bg-danger text-danger-foreground'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <X className="w-3.5 h-3.5" />
          <span>Can&apos;t Go</span>
        </button>
      </div>
    </div>
  );
}

'use client';

import { CheckCircle2 } from 'lucide-react';
import type { PollData } from '../../types/communication.types';

export interface PollCardProps {
  pollData: PollData;
  messageId: string;
  conversationId: string;
  currentUserId: string;
  onVote: (conversationId: string, messageId: string, optionId: string) => void;
}

export function PollCard({
  pollData,
  messageId,
  conversationId,
  currentUserId,
  onVote,
}: PollCardProps) {
  const isClosed = Boolean(pollData.closedAt);
  const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.voterIds.length, 0);

  return (
    <div className="w-full my-2 p-4 rounded-xl bg-card border border-border text-card-foreground shadow-xs">
      {/* Question Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h4 className="font-semibold text-sm text-foreground">{pollData.question}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isClosed ? 'Poll Closed' : pollData.allowMultiple ? 'Select one or more' : 'Select one option'}
            {' • '}
            {totalVotes} vote{totalVotes === 1 ? '' : 's'}
          </p>
        </div>
        {isClosed && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase">
            Closed
          </span>
        )}
      </div>

      {/* Poll Options */}
      <div className="space-y-2.5">
        {pollData.options.map(option => {
          const voteCount = option.voterIds.length;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const hasVoted = option.voterIds.includes(currentUserId);

          return (
            <button
              key={option.id}
              type="button"
              disabled={isClosed}
              onClick={() => onVote(conversationId, messageId, option.id)}
              className={`w-full relative overflow-hidden text-left p-3 rounded-lg border transition-all ${
                hasVoted
                  ? 'border-primary bg-primary/5 font-medium'
                  : 'border-border hover:border-primary/50 bg-background'
              } ${isClosed ? 'cursor-default' : 'cursor-pointer'}`}
            >
              {/* Progress Bar Fill */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-primary/10 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />

              <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  {hasVoted && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                  <span className="truncate text-foreground font-medium">{option.label}</span>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 text-muted-foreground">
                  <span>{voteCount}</span>
                  <span className="text-[10px]">({percentage}%)</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

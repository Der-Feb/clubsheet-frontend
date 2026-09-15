'use client';

import { useState } from 'react';
import { AtSign, Check, Edit2, X } from 'lucide-react';
import { useCommunication } from '../../context/communication.context';
import { parseUsername } from '../../utils/username.utils';

export function UsernameSetupBanner() {
  const { currentUsername, updateUsername } = useCommunication();
  const [isEditing, setIsEditing] = useState(false);
  const [inputVal, setInputVal] = useState(currentUsername);
  const [isDismissed, setIsDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isDismissed) return null;

  const handleSave = () => {
    const parsed = parseUsername(inputVal);
    if (!parsed) {
      setError('Username can only contain lowercase letters, numbers, dots, and underscores.');
      return;
    }
    updateUsername(parsed);
    setError(null);
    setIsEditing(false);
  };

  return (
    <div className="bg-primary/10 border-b border-primary/20 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div className="flex items-center gap-2 text-foreground font-medium min-w-0">
        <AtSign className="w-4 h-4 text-primary shrink-0" />
        {isEditing ? (
          <div className="flex items-center gap-2">
            <label htmlFor="chat-username" className="text-muted-foreground">
              Your handle: @
            </label>
            <input
              id="chat-username"
              type="text"
              value={inputVal}
              onChange={e => {
                setInputVal(e.target.value);
                setError(null);
              }}
              className="px-2 py-1 rounded bg-background border border-border text-foreground font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleSave}
              aria-label="Save username"
              className="p-1 rounded bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <p className="truncate">
            Your chat username is{' '}
            <span className="font-bold text-primary font-mono">@{currentUsername}</span>
          </p>
        )}
      </div>

      {error && <p className="w-full text-danger text-[11px] font-semibold">{error}</p>}

      <div className="flex items-center gap-2">
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 text-primary hover:underline font-semibold"
          >
            <Edit2 className="w-3 h-3" />
            <span>Change</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss banner"
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

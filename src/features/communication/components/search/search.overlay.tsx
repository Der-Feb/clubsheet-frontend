'use client';

import { useState, useMemo } from 'react';
import { Search, X, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useCommunication } from '../../context/communication.context';
import { searchMessages } from '../../utils/search.utils';

export interface SearchOverlayProps {
  onSelectResult?: (messageId: string) => void;
}

export function SearchOverlay({ onSelectResult }: SearchOverlayProps) {
  const {
    isSearchOpen,
    toggleSearch,
    activeConversationId,
    messages,
    members,
    groups,
  } = useCommunication();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'people' | 'groups'>('messages');

  const activeMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return messages[activeConversationId] || [];
  }, [activeConversationId, messages]);

  const messageResults = useMemo(() => {
    return searchMessages(query, activeMessages);
  }, [query, activeMessages]);

  const peopleResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return Object.values(members).filter(
      m =>
        m.displayName.toLowerCase().includes(q) ||
        m.username.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
    );
  }, [query, members]);

  const groupResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return groups.filter(
      g => g.name.toLowerCase().includes(q) || (g.description && g.description.toLowerCase().includes(q))
    );
  }, [query, groups]);

  if (!isSearchOpen) return null;

  return (
    <div className="absolute inset-0 z-20 bg-background/95 backdrop-blur-xs flex flex-col overflow-hidden">
      {/* Search Bar Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
        <Search className="w-5 h-5 text-muted-foreground shrink-0" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search messages, people, or groups..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
        />
        <button
          type="button"
          onClick={toggleSearch}
          aria-label="Close search"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-border bg-card px-4 gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`py-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'messages'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Messages ({messageResults.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('people')}
          className={`py-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'people'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          People ({peopleResults.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('groups')}
          className={`py-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'groups'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Groups ({groupResults.length})
        </button>
      </div>

      {/* Results Container */}
      <div className="flex-1 overflow-y-auto p-4">
        {!query.trim() ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
            <Search className="w-8 h-8 mb-2 text-muted-foreground/40" />
            <p className="text-xs">Type a keyword to start searching</p>
          </div>
        ) : activeTab === 'messages' ? (
          messageResults.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No messages found matching &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-2">
              {messageResults.map(msg => {
                const sender = members[msg.senderId];
                const date = new Date(msg.createdAt);
                const timeStr = isNaN(date.getTime()) ? '' : format(date, 'MMM d, h:mm a');

                return (
                  <button
                    key={msg.id}
                    type="button"
                    onClick={() => {
                      onSelectResult?.(msg.id);
                      toggleSearch();
                    }}
                    className="w-full text-left p-3 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-foreground font-mono">
                        {sender ? `@${sender.username}` : 'Unknown'}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{timeStr}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{msg.content}</p>
                  </button>
                );
              })}
            </div>
          )
        ) : activeTab === 'people' ? (
          peopleResults.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">
              No people found matching &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-2">
              {peopleResults.map(m => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                    {m.initials}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground font-mono">@{m.username}</h5>
                    <p className="text-[10px] text-muted-foreground">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : groupResults.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
            No groups found matching &quot;{query}&quot;
          </div>
        ) : (
          <div className="space-y-2">
            {groupResults.map(g => (
              <div
                key={g.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
              >
                <Users className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-foreground">{g.name}</h5>
                  <p className="text-[10px] text-muted-foreground">
                    {g.description || `${g.memberIds.length} members`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

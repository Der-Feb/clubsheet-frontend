'use client';

import React from 'react';

// ==========================================
// 1. CALENDAR COMPONENT
// ==========================================

export type CalendarDay = {
  day: number;
  weekday?: string;
  isImportant?: boolean;
  eventLabel?: string;
};

export interface CalendarProps {
  /** Height of the card (e.g., "8.5rem", "12rem", "100%", "auto"). Defaults to "8.5rem" */
  height?: string;
  /** Custom max width utility class. Defaults to "max-w-xs" */
  maxWidth?: string;
  /** Font family utility class (e.g., "font-mono", "font-sans"). Defaults to "font-mono" */
  fontFamily?: string;
  /** Header text size class. Defaults to "text-xs" */
  headerFontSize?: string;
  /** Weekday header font size class. Defaults to "text-[9px]" */
  weekHeaderFontSize?: string;
  /** Date text size class. Defaults to "text-xs" */
  gridFontSize?: string;
  /** Card background color. Defaults to "bg-white" */
  bgColor?: string;
  /** Header title label */
  title?: string;
  /** Optional badge text label */
  badgeText?: string;
  /** Array of 14 days for the 2-week focus grid */
  days?: CalendarDay[];
  /** Additional container classes */
  className?: string;
}

const defaultDays: CalendarDay[] = [
  { day: 10, weekday: 'M' },
  { day: 11, weekday: 'T' },
  { day: 12, weekday: 'W', isImportant: true, eventLabel: 'Vs Arsenal U18' },
  { day: 13, weekday: 'T' },
  { day: 14, weekday: 'F' },
  { day: 15, weekday: 'S' },
  { day: 16, weekday: 'S' },
  { day: 17, weekday: 'M' },
  { day: 18, weekday: 'T' },
  { day: 19, weekday: 'W' },
  { day: 20, weekday: 'T', isImportant: true, eventLabel: 'Tactical Review' },
  { day: 21, weekday: 'F' },
  { day: 22, weekday: 'S', isImportant: true, eventLabel: 'Cup Match' },
  { day: 23, weekday: 'S' },
];

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const Calendar: React.FC<CalendarProps> = ({
  height = '8.5rem',
  maxWidth = 'max-w-xs',
  fontFamily = 'font-mono',
  headerFontSize = 'text-xs',
  weekHeaderFontSize = 'text-[9px]',
  gridFontSize = 'text-xs',
  bgColor = 'bg-white',
  title = 'fixtures and plans',
  badgeText = '3 Fixtures',
  days = defaultDays,
  className = '',
}) => {
  return (
    <div
      style={{ height }}
      className={`w-full ${maxWidth} ${fontFamily} ${bgColor} rounded-lg border border-zinc-200 shadow-sm flex flex-col overflow-hidden shrink-0 transition-all ${className}`}
    >
      {/* Clean Header Bar */}
      <div className={`flex items-center justify-between border-b border-zinc-200 bg-zinc-100/80 px-2.5 py-1.5 shrink-0 text-zinc-600 ${headerFontSize}`}>
        <div className="flex items-center gap-1.5 min-w-0">
          <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-semibold text-emerald-600 truncate capitalize">{title}</span>
          {badgeText && (
            <span className="rounded bg-emerald-100 px-1 py-0.5 text-[8px] font-bold text-emerald-700 shrink-0">
              {badgeText}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 min-h-0 p-2 flex flex-col justify-between overflow-hidden">
        {/* Days Header */}
        <div className={`grid grid-cols-7 gap-1 text-center font-medium text-zinc-400 uppercase ${weekHeaderFontSize}`}>
          {weekDays.map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* 2-Week Dates Grid */}
        <div className={`grid grid-cols-7 gap-1 text-center font-sans ${gridFontSize}`}>
          {days.map((item, idx) => (
            <div
              key={idx}
              title={item.eventLabel}
              className={`relative flex items-center justify-center h-6 rounded transition-all ${
                item.isImportant
                  ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-300'
                  : 'text-zinc-600 hover:bg-zinc-100 font-medium'
              }`}
            >
              <span>{item.day}</span>
              {item.isImportant && (
                <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 2. GROUP CHAT COMPONENT
// ==========================================

export type ChatMessage = {
  id: string | number;
  sender: string;
  role?: string;
  text: string;
  time: string;
  isImportant?: boolean;
  avatarColor?: string;
};

export interface GroupChatProps {
  /** Height of the card (e.g., "8.5rem", "12rem", "auto"). Defaults to "8.5rem" */
  height?: string;
  /** Custom max width utility class. Defaults to "max-w-xs" */
  maxWidth?: string;
  /** Font family utility class (e.g., "font-mono", "font-sans"). Defaults to "font-mono" */
  fontFamily?: string;
  /** Header text size class. Defaults to "text-xs" */
  headerFontSize?: string;
  /** Message text size class. Defaults to "text-[10px]" */
  messageFontSize?: string;
  /** Card background color. Defaults to "bg-white" */
  bgColor?: string;
  /** Title label for the window header */
  title?: string;
  /** Optional status label */
  statusText?: string;
  /** Array of messages to display */
  messages?: ChatMessage[];
  /** Additional container classes */
  className?: string;
}

const defaultMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'Coach Marcus',
    role: 'Head Coach',
    text: 'Guys, kick-off moved to 3 PM! Who has the kits?',
    time: '14:02',
    isImportant: true,
    avatarColor: 'bg-emerald-500',
  },
  {
    id: 2,
    sender: 'Alex',
    text: 'I left them in the shed, but it’s locked 😅',
    time: '14:05',
    avatarColor: 'bg-zinc-400',
  },
  {
    id: 3,
    sender: 'Daniel',
    text: 'Who has the key?? We start in 1 hr!',
    time: '14:06',
    avatarColor: 'bg-amber-500',
  },
];

export const GroupChat: React.FC<GroupChatProps> = ({
  height = '8.5rem',
  maxWidth = 'max-w-xs',
  fontFamily = 'font-mono',
  headerFontSize = 'text-xs',
  messageFontSize = 'text-[10px]',
  bgColor = 'bg-white',
  title = 'u18_team_chat',
  statusText = '12 unread',
  messages = defaultMessages,
  className = '',
}) => {
  return (
    <div
      style={{ height }}
      className={`w-full ${maxWidth} ${fontFamily} ${bgColor} rounded-lg border border-zinc-200 shadow-sm flex flex-col overflow-hidden shrink-0 transition-all ${className}`}
    >
      {/* Window Header */}
      <div className={`flex items-center justify-between border-b border-zinc-200 bg-zinc-100/80 px-2.5 py-1.5 shrink-0 text-zinc-600 ${headerFontSize}`}>
        <div className="flex items-center gap-1.5 min-w-0">
          <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-semibold text-emerald-600 truncate">{title}</span>
          {statusText && (
            <span className="rounded bg-rose-100 px-1 py-0.5 text-[8px] font-bold text-rose-700 shrink-0 animate-pulse">
              {statusText}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        </div>
      </div>

      {/* Messages Stream Container */}
      <div className={`flex-1 min-h-0 p-2 space-y-1.5 overflow-hidden flex flex-col justify-end font-sans ${messageFontSize}`}>
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-1.5">
            {/* Avatar */}
            <div className={`h-4 w-4 rounded-full ${msg.avatarColor || 'bg-zinc-300'} text-white text-[7px] font-bold flex items-center justify-center shrink-0 mt-0.5`}>
              {msg.sender.charAt(0)}
            </div>

            {/* Bubble Content */}
            <div className={`rounded-md p-1.5 leading-tight w-full ${msg.isImportant ? 'bg-amber-50 border border-amber-200 text-zinc-800' : 'bg-zinc-100 text-zinc-700'}`}>
              <div className="flex items-center justify-between text-[8px] mb-0.5 font-mono">
                <span className="font-bold text-zinc-900 truncate">
                  {msg.sender} {msg.role && <span className="text-emerald-600 font-normal">({msg.role})</span>}
                </span>
                <span className="text-zinc-400 text-[7.5px] shrink-0 ml-1">{msg.time}</span>
              </div>
              <p className="truncate text-zinc-600">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ==========================================
// 3. PLAYER CARD COMPONENT
// ==========================================

export type PlayerStat = {
  label: string;
  value: string | number;
};

export interface PlayerCardProps {
  /** Height of the card (e.g., "8.5rem", "12rem", "auto"). Defaults to "8.5rem" */
  height?: string;
  /** Custom max width utility class. Defaults to "max-w-xs" */
  maxWidth?: string;
  /** Font family utility class (e.g., "font-mono", "font-sans"). Defaults to "font-mono" */
  fontFamily?: string;
  /** Header text size class. Defaults to "text-xs" */
  headerFontSize?: string;
  /** Details text size class. Defaults to "text-[10px]" */
  detailsFontSize?: string;
  /** Card background color. Defaults to "bg-white" */
  bgColor?: string;
  /** Window title */
  title?: string;
  /** Player name */
  name?: string;
  /** Player squad number */
  number?: string | number;
  /** Position badge */
  position?: string;
  /** Squad or team name */
  team?: string;
  /** Status pill text */
  statusText?: string;
  /** Custom player stats array */
  stats?: PlayerStat[];
  /** Additional container classes */
  className?: string;
}

const defaultStats: PlayerStat[] = [
  { label: 'P', value: 14 },
  { label: 'G', value: 9 },
  { label: 'A', value: 5 },
  { label: 'FIT', value: '88%' },
];

export const PlayerCard: React.FC<PlayerCardProps> = ({
  height = '8.5rem',
  maxWidth = 'max-w-xs',
  fontFamily = 'font-mono',
  headerFontSize = 'text-xs',
  detailsFontSize = 'text-[10px]',
  bgColor = 'bg-white',
  title = 'player_profile',
  name = 'Liam Davies',
  number = '10',
  position = 'CAM',
  team = 'U18 Squad',
  statusText = 'Active',
  stats = defaultStats,
  className = '',
}) => {
  return (
    <div
      style={{ height }}
      className={`w-full ${maxWidth} ${fontFamily} ${bgColor} rounded-lg border border-zinc-200 shadow-sm flex flex-col overflow-hidden shrink-0 transition-all ${className}`}
    >
      {/* Window Header Bar */}
      <div className={`flex items-center justify-between border-b border-zinc-200 bg-zinc-100/80 px-2.5 py-1.5 shrink-0 text-zinc-600 ${headerFontSize}`}>
        <div className="flex items-center gap-1.5 min-w-0">
          <svg className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-semibold text-emerald-600 truncate">{title}</span>
          {statusText && (
            <span className="rounded bg-emerald-100 px-1 py-0.5 text-[8px] font-bold text-emerald-700 shrink-0">
              {statusText}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 min-h-0 p-2 flex flex-col justify-between overflow-hidden bg-white">
        {/* Main Info Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {/* Number Avatar */}
            <div className="h-7 w-7 rounded-md bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              #{number}
            </div>

            {/* Name & Position */}
            <div className="min-w-0 font-sans">
              <h4 className="font-bold text-zinc-900 text-xs truncate leading-tight">{name}</h4>
              <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-mono mt-0.5">
                <span className="rounded bg-zinc-100 border border-zinc-200 px-1 font-bold text-zinc-700">{position}</span>
                <span className="truncate">• {team}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-1 pt-1 border-t border-zinc-100 text-center font-mono">
          {stats.map((stat, i) => (
            <div key={i} className="bg-zinc-50 rounded p-1 border border-zinc-100">
              <div className="text-[7.5px] text-zinc-400 font-medium uppercase">{stat.label}</div>
              <div className={`font-bold text-zinc-800 ${detailsFontSize}`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 4. SPREADSHEET COMPONENT
// ==========================================

export type PlayerData = {
  name: string;
  age: number;
  position: string;
  team: string;
  [key: string]: string | number;
};

export interface SpreadSheetProps {
  /** Height of the container (e.g., "7rem", "8.5rem", "100%", "300px"). Defaults to "8.5rem" */
  height?: string;
  /** Custom max width. Defaults to "max-w-sm" */
  maxWidth?: string;
}

const defaultSpreadsheetData: PlayerData[] = [
  { name: 'Alex', age: 18, position: 'Goalkeeper', team: 'U18' },
  { name: 'Daniel', age: 19, position: 'Defender', team: 'U18' },
  { name: 'Michael', age: 20, position: 'Midfielder', team: 'U16' },
];

export const SpreadSheet: React.FC<SpreadSheetProps> = ({
  height = '8.5rem',
  maxWidth = 'max-w-sm',
}) => {
  const keys = Array.from(new Set(defaultSpreadsheetData.flatMap((obj) => Object.keys(obj))));
  const isCompact = height === '7rem' || height === '8.5rem';

  return (
    <div
      style={{ height }}
      className={`${maxWidth} w-full rounded-lg border border-zinc-200 bg-white font-mono shadow-sm overflow-hidden flex flex-col transition-all duration-200 ${
        isCompact ? 'text-[10px]' : 'text-xs md:text-sm'
      }`}
    >
      {/* Window Header */}
      <div
        className={`flex items-center justify-between border-b border-zinc-200 bg-zinc-100/80 px-2.5 shrink-0 text-zinc-600 ${
          isCompact ? 'py-1 text-[9px]' : 'py-2 text-xs'
        }`}
      >
        <span className="font-semibold text-emerald-600 truncate">players_2026.xlsx</span>
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-zinc-200">
        <table className="w-full border-collapse text-left">
          <thead
            className={`sticky top-0 bg-zinc-100 z-10 border-b border-zinc-200 uppercase tracking-wider text-zinc-500 ${
              isCompact ? 'text-[9px]' : 'text-[11px]'
            }`}
          >
            <tr>
              <th
                className={`border-r border-zinc-200 text-center text-zinc-400 font-medium ${
                  isCompact ? 'px-2 py-0.5 w-5' : 'px-3 py-1.5 w-8'
                }`}
              >
                #
              </th>
              {keys.map((key) => (
                <th
                  key={key}
                  className={`border-r border-zinc-200 font-medium whitespace-nowrap ${
                    isCompact ? 'px-2 py-0.5' : 'px-3 py-1.5'
                  }`}
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/70 text-zinc-700">
            {defaultSpreadsheetData.map((item, index) => (
              <tr key={index} className="hover:bg-zinc-50 transition-colors">
                <td
                  className={`border-r border-zinc-200 text-center text-zinc-400 ${
                    isCompact ? 'px-2 py-0.5 text-[8px]' : 'px-3 py-1.5 text-xs'
                  }`}
                >
                  {index + 1}
                </td>
                {keys.map((key) => (
                  <td
                    key={key}
                    className={`border-r border-zinc-200 whitespace-nowrap ${
                      isCompact ? 'px-2 py-0.5' : 'px-3 py-1.5'
                    }`}
                  >
                    {item[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
'use client';

import React from 'react';
import { CoachCard, NotificationCard, TrainingCard } from './cards/training&coach';
import { DocumentsCard, FinancialCard, PermissionCard } from './cards/admin&docs';
import { ActionTasksCard, KitEquipmentCard, MedicalRecordCard } from './cards/operations&tasks';
import Calendar, { GroupChat, PlayerCard, SpreadSheet } from './cards/core&training';

// ---------------------------------------------------------------------------
// Card layer types
// ---------------------------------------------------------------------------

export type CardLayer = 'bg' | 'mid' | 'fg';

export interface ChaosCard {
  /** Unique id — must match the corresponding slot id in clarity.state.tsx */
  id: string;
  /** The React card component to render */
  component: React.ReactElement;
  /**
   * Absolute positioning + initial rotation Tailwind classes.
   * GSAP will drive x/y/rotation during the scroll sequence so we
   * only use these for the starting layout — never fight them with
   * inline GSAP transforms after init.
   */
  positionClass: string;
  /** Depth layer — used to calculate differential parallax speeds */
  layer: CardLayer;
}

// ---------------------------------------------------------------------------
// Parallax speed multipliers per layer
// ---------------------------------------------------------------------------

export const LAYER_SPEED: Record<CardLayer, number> = {
  bg: 0.6,
  mid: 1.0,
  fg: 1.4,
};

// ---------------------------------------------------------------------------
// Card definitions
//
// The card field starts at 120px from top (below the headline strip).
// Cards are positioned relative to that field, scattered left and right
// of center with some overlapping the middle — creating the visual chaos
// of scattered tools surrounding where the dashboard will appear.
// ---------------------------------------------------------------------------

export const chaosCards: ChaosCard[] = [
  // ── Background layer ─────────────────────────────────────────────────────
  {
    id: 'spreadsheet',
    component: <SpreadSheet height="100%" />,
    positionClass: 'top-[5%] left-[8%] -rotate-6',
    layer: 'bg',
  },
  {
    id: 'documents',
    component: <DocumentsCard height="100%" />,
    positionClass: 'top-[58%] left-[10%] rotate-3',
    layer: 'bg',
  },
  {
    id: 'financial',
    component: <FinancialCard height="100%" />,
    positionClass: 'top-[62%] right-[10%] rotate-5',
    layer: 'bg',
  },
  {
    id: 'medical',
    component: <MedicalRecordCard height="100%" />,
    positionClass: 'top-[4%] right-[8%] rotate-4',
    layer: 'bg',
  },

  // ── Mid layer ─────────────────────────────────────────────────────────────
  {
    id: 'calendar',
    component: <Calendar height="100%" />,
    positionClass: 'top-[25%] right-[14%] rotate-3',
    layer: 'mid',
  },
  {
    id: 'trainingCard',
    component: <TrainingCard height="100%" />,
    positionClass: 'top-[28%] left-[14%] rotate-6',
    layer: 'mid',
  },
  {
    id: 'coachCard',
    component: <CoachCard height="100%" />,
    positionClass: 'top-[18%] right-[30%] -rotate-4',
    layer: 'mid',
  },
  {
    id: 'permission',
    component: <PermissionCard height="100%" />,
    positionClass: 'top-[45%] left-[28%] -rotate-3',
    layer: 'mid',
  },
  {
    id: 'kitEquipment',
    component: <KitEquipmentCard height="100%" />,
    positionClass: 'top-[70%] right-[24%] -rotate-5',
    layer: 'mid',
  },

  // ── Foreground layer ──────────────────────────────────────────────────────
  {
    id: 'groupChat',
    component: <GroupChat height="100%" />,
    positionClass: 'top-[10%] left-[26%] rotate-8',
    layer: 'fg',
  },
  {
    id: 'playerCard',
    component: <PlayerCard height="100%" />,
    positionClass: 'top-[8%] right-[26%] -rotate-8',
    layer: 'fg',
  },
  {
    id: 'notification',
    component: <NotificationCard height="100%" />,
    positionClass: 'top-[40%] left-[6%] -rotate-5',
    layer: 'fg',
  },
  {
    id: 'actionTasks',
    component: <ActionTasksCard height="100%" />,
    positionClass: 'top-[78%] left-[32%] rotate-2',
    layer: 'fg',
  },
];

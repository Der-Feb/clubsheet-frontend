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
  id: string;
  component: React.ReactElement;
  /** Absolute positioning Tailwind classes only — NO rotation classes */
  positionClass: string;
  /** Initial rotation in degrees — applied via gsap.set so GSAP owns the transform */
  initialRotation: number;
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
    positionClass: 'top-[5%] left-[8%]',
    initialRotation: -6,
    layer: 'bg',
  },
  {
    id: 'documents',
    component: <DocumentsCard height="100%" />,
    positionClass: 'top-[58%] left-[10%]',
    initialRotation: 3,
    layer: 'bg',
  },
  {
    id: 'financial',
    component: <FinancialCard height="100%" />,
    positionClass: 'top-[62%] right-[10%]',
    initialRotation: 5,
    layer: 'bg',
  },
  {
    id: 'medical',
    component: <MedicalRecordCard height="100%" />,
    positionClass: 'top-[4%] right-[8%]',
    initialRotation: 4,
    layer: 'bg',
  },

  // ── Mid layer ─────────────────────────────────────────────────────────────
  {
    id: 'calendar',
    component: <Calendar height="100%" />,
    positionClass: 'top-[25%] right-[14%]',
    initialRotation: 3,
    layer: 'mid',
  },
  {
    id: 'trainingCard',
    component: <TrainingCard height="100%" />,
    positionClass: 'top-[28%] left-[14%]',
    initialRotation: 6,
    layer: 'mid',
  },
  {
    id: 'coachCard',
    component: <CoachCard height="100%" />,
    positionClass: 'top-[18%] right-[30%]',
    initialRotation: -4,
    layer: 'mid',
  },
  {
    id: 'permission',
    component: <PermissionCard height="100%" />,
    positionClass: 'top-[45%] left-[28%]',
    initialRotation: -3,
    layer: 'mid',
  },
  {
    id: 'kitEquipment',
    component: <KitEquipmentCard height="100%" />,
    positionClass: 'top-[70%] right-[24%]',
    initialRotation: -5,
    layer: 'mid',
  },

  // ── Foreground layer ──────────────────────────────────────────────────────
  {
    id: 'groupChat',
    component: <GroupChat height="100%" />,
    positionClass: 'top-[10%] left-[26%]',
    initialRotation: 8,
    layer: 'fg',
  },
  {
    id: 'playerCard',
    component: <PlayerCard height="100%" />,
    positionClass: 'top-[8%] right-[26%]',
    initialRotation: -8,
    layer: 'fg',
  },
  {
    id: 'notification',
    component: <NotificationCard height="100%" />,
    positionClass: 'top-[40%] left-[6%]',
    initialRotation: -5,
    layer: 'fg',
  },
  {
    id: 'actionTasks',
    component: <ActionTasksCard height="100%" />,
    positionClass: 'top-[78%] left-[32%]',
    initialRotation: 2,
    layer: 'fg',
  },
];

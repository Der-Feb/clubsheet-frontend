"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { Club } from "@/mocks/clubs.mock";
import { MOCK_ACTIVE_CLUB, MOCK_CLUBS } from "@/mocks/clubs.mock";
import {
  getStoredActiveClubId,
  persistActiveClubId,
} from "@/lib/theme-storage.utils";

let activeClubId = MOCK_ACTIVE_CLUB.id;
let hasHydratedActiveClub = false;
const activeClubListeners = new Set<() => void>();

function getValidClubId(clubId?: string) {
  return clubId && MOCK_CLUBS.some((club) => club.id === clubId) ? clubId : null;
}

function initializeActiveClub(clubId?: string) {
  const initialClubId = getValidClubId(clubId);
  if (typeof window !== "undefined" && !hasHydratedActiveClub && initialClubId) {
    activeClubId = initialClubId;
  }
  return initialClubId || MOCK_ACTIVE_CLUB.id;
}

function subscribeToActiveClub(listener: () => void) {
  activeClubListeners.add(listener);
  return () => activeClubListeners.delete(listener);
}

function getActiveClubSnapshot() {
  return activeClubId;
}

function notifyActiveClubChange() {
  activeClubListeners.forEach((listener) => listener());
}

function hydrateActiveClub() {
  if (hasHydratedActiveClub) return;
  hasHydratedActiveClub = true;

  const storedId = getStoredActiveClubId();
  const storedClub = storedId && MOCK_CLUBS.find((club) => club.id === storedId);
  if (storedClub && storedClub.id !== activeClubId) {
    activeClubId = storedClub.id;
    notifyActiveClubChange();
  }
  persistActiveClubId(activeClubId);
}

export interface UseCurrentClubReturn {
  activeClub: Club;
  clubs: Club[];
  setActiveClub: (club: Club) => void;
}

/**
 * Returns the shared active club selection and the full list of available mock clubs.
 * The selection hydrates from browser storage; updates are shared across hook consumers and saved.
 */
export function useCurrentClub(initialClubId?: string): UseCurrentClubReturn {
  const resolvedInitialClubId = initializeActiveClub(initialClubId);
  const activeClubIdSnapshot = useSyncExternalStore(
    subscribeToActiveClub,
    getActiveClubSnapshot,
    () => resolvedInitialClubId
  );

  useEffect(() => {
    hydrateActiveClub();
  }, []);

  const activeClub = MOCK_CLUBS.find((club) => club.id === activeClubIdSnapshot) || MOCK_ACTIVE_CLUB;
  const setActiveClub = useCallback((club: Club) => {
    activeClubId = club.id;
    persistActiveClubId(club.id);
    notifyActiveClubChange();
  }, []);

  return {
    activeClub,
    clubs: MOCK_CLUBS,
    setActiveClub,
  };
}

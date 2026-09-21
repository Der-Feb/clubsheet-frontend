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

function subscribeToActiveClub(listener: () => void) {
  activeClubListeners.add(listener);
  return () => activeClubListeners.delete(listener);
}

function getActiveClubSnapshot() {
  return activeClubId;
}

function getActiveClubServerSnapshot() {
  return MOCK_ACTIVE_CLUB.id;
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
 * Returns the currently active club and the full list of available clubs.
 * Currently backed by mock data — replace internals with real state/API later.
 */
export function useCurrentClub(): UseCurrentClubReturn {
  const activeClubIdSnapshot = useSyncExternalStore(
    subscribeToActiveClub,
    getActiveClubSnapshot,
    getActiveClubServerSnapshot
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

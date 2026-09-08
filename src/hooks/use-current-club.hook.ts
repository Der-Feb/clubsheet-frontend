"use client";

import { useState } from "react";
import type { Club } from "@/mocks/clubs.mock";
import { MOCK_ACTIVE_CLUB, MOCK_CLUBS } from "@/mocks/clubs.mock";

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
  const [activeClub, setActiveClub] = useState<Club>(MOCK_ACTIVE_CLUB);

  return {
    activeClub,
    clubs: MOCK_CLUBS,
    setActiveClub,
  };
}

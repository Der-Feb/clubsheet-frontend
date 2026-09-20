"use client";

import { useEffect, useState } from "react";
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
  const [activeClub, setActiveClubState] = useState<Club>(MOCK_ACTIVE_CLUB);

  useEffect(() => {
    const storedId = window.localStorage.getItem("clubsheet_active_club");
    const storedClub = MOCK_CLUBS.find((club) => club.id === storedId);
    if (storedClub) setActiveClubState(storedClub);
  }, []);

  const setActiveClub = (club: Club) => {
    setActiveClubState(club);
    try {
      window.localStorage.setItem("clubsheet_active_club", club.id);
    } catch {
      // Storage may be unavailable in privacy-restricted browsers.
    }
  };

  return {
    activeClub,
    clubs: MOCK_CLUBS,
    setActiveClub,
  };
}

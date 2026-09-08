import type { KitColors } from "@/types/theme.types";

export interface Club {
  id: string;
  name: string;
  /** Short abbreviation shown in the avatar when no logo is available. */
  abbr: string;
  logo?: string;
  /**
   * Optional kit colour palette used to skin the app when this club is active.
   * If omitted, the app falls back to the default ClubSheet brand colours.
   */
  kitColors?: KitColors;
}

export const MOCK_CLUBS: Club[] = [
  {
    id: "club-1",
    name: "Kigali FC",
    abbr: "KFC",
    kitColors: { primary: "#005F31", secondary: "#DFE3DA", tertiary: "#F7FBF3" },
  },
  {
    id: "club-2",
    name: "Gasabo United",
    abbr: "GU",
    kitColors: { primary: "#1A3A8F", secondary: "#FFFFFF", tertiary: "#C8A951" },
  },
  {
    id: "club-3",
    name: "Rwanda Academy",
    abbr: "RA",
    kitColors: { primary: "#8B0000", secondary: "#FFD700" },
  },
];

export const MOCK_ACTIVE_CLUB: Club = MOCK_CLUBS[0];

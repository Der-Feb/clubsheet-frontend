import type { ClubBrand } from "@/types/theme.types";

export interface Club {
  id: string;
  name: string;
  /** Short abbreviation shown in the avatar when no logo is available. */
  abbr: string;
  logo?: string;
  /**
   * Optional club branding / kit colours.
   * If omitted, falls back to the default ClubSheet brand palette.
   */
  brand?: ClubBrand;
}

export const MOCK_CLUBS: Club[] = [
  {
    id: "club-1",
    name: "Kigali FC",
    abbr: "KFC",
    brand: { primary: "#005F31", secondary: "#DFE3DA", tertiary: "#01562D" },
  },
  {
    id: "club-2",
    name: "Gasabo United (Chelsea Blue)",
    abbr: "GU",
    brand: { primary: "#034694", secondary: "#FFFFFF", tertiary: "#DBA111" },
  },
  {
    id: "club-3",
    name: "Rwanda Academy (Arsenal Red)",
    abbr: "RA",
    brand: { primary: "#EF0107", secondary: "#FFFFFF", tertiary: "#063672" },
  },
];

export const MOCK_ACTIVE_CLUB: Club = MOCK_CLUBS[0];

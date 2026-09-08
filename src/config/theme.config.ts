import type { ClubBrand } from "@/types/theme.types";

/**
 * Default ClubSheet brand palette used when no custom club branding is provided.
 */
export const DEFAULT_CLUBSHEET_BRAND: ClubBrand = {
  primary: "#005F31", // Forest Green
  secondary: "#DFE3DA", // Light sage / silver trim
  tertiary: "#01562D", // Deep emerald
};

/**
 * Fixed semantic status colors that NEVER inherit from club brand.
 * Stays constant regardless of club kit colors.
 */
export const SEMANTIC_STATUS_COLORS = {
  success: {
    light: "#16a34a", // Green 600
    dark: "#22c55e",  // Green 500
  },
  warning: {
    light: "#d97706", // Amber 600
    dark: "#f59e0b",  // Amber 500
  },
  danger: {
    light: "#dc2626", // Red 600
    dark: "#ef4444",  // Red 500
  },
  info: {
    light: "#0284c7", // Sky 600
    dark: "#38bdf8",  // Sky 400
  },
};

export interface KitPalettePreset {
  id: string;
  name: string;
  description: string;
  brand: ClubBrand;
}

/**
 * Premade kit color palettes for well-known football clubs that users/clubs can select or customize.
 */
export const KIT_PRESETS: KitPalettePreset[] = [
  {
    id: "default-clubsheet",
    name: "ClubSheet Classic",
    description: "Original emerald green and sage",
    brand: DEFAULT_CLUBSHEET_BRAND,
  },
  {
    id: "chelsea-blue",
    name: "Royal Blue & White (e.g. Chelsea)",
    description: "Classic royal blue home kit with white trim and gold accent",
    brand: {
      primary: "#034694",
      secondary: "#FFFFFF",
      tertiary: "#DBA111",
    },
  },
  {
    id: "manchester-red",
    name: "Scarlet & White (e.g. Manchester)",
    description: "Vibrant scarlet red with crisp white and gold trim",
    brand: {
      primary: "#DA291C",
      secondary: "#FFFFFF",
      tertiary: "#FFE500",
    },
  },
  {
    id: "arsenal-cannon",
    name: "Cardinal & White (e.g. Arsenal)",
    description: "Deep cardinal red with clean white sleeves and navy trim",
    brand: {
      primary: "#EF0107",
      secondary: "#FFFFFF",
      tertiary: "#063672",
    },
  },
  {
    id: "barcelona-blaugrana",
    name: "Blaugrana (e.g. Barcelona)",
    description: "Iconic deep royal blue, garnet maroon, and Catalan gold",
    brand: {
      primary: "#004D98",
      secondary: "#A50044",
      tertiary: "#EDBB00",
    },
  },
  {
    id: "real-madrid-blanco",
    name: "Los Blancos (e.g. Real Madrid)",
    description: "Pure white with royal purple/navy and gold accents",
    brand: {
      primary: "#0C2340",
      secondary: "#FFFFFF",
      tertiary: "#EEB111",
    },
  },
  {
    id: "juventus-bianconeri",
    name: "Bianconeri (e.g. Juventus)",
    description: "Timeless monochrome black and white with vibrant gold",
    brand: {
      primary: "#000000",
      secondary: "#FFFFFF",
      tertiary: "#D4AF37",
    },
  },
  {
    id: "bayern-rot",
    name: "Bavarian Crimson (e.g. Bayern)",
    description: "Classic Bavarian crimson red with deep navy and white",
    brand: {
      primary: "#DC052D",
      secondary: "#0066B2",
      tertiary: "#FFFFFF",
    },
  },
  {
    id: "dortmund-bvb",
    name: "Schwarzgelb (e.g. Dortmund)",
    description: "High-contrast cyber yellow and deep carbon black",
    brand: {
      primary: "#FDE100",
      secondary: "#000000",
      tertiary: "#808080",
    },
  },
];

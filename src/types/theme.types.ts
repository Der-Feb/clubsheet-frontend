/**
 * The raw preference stored by the user.
 * "system" = follow the OS / browser preference automatically.
 */
export type ThemeMode = "system" | "light" | "dark";

/**
 * The mode that is actually being rendered right now.
 * Never "system" — "system" resolves to either "light" or "dark".
 */
export type ResolvedThemeMode = "light" | "dark";

/**
 * A club's brand colours.  All fields are optional — the theme engine
 * generates whatever is missing so even a zero-colour club gets a full palette.
 *
 * - primary   → the dominant kit / brand colour  (e.g. Chelsea blue)
 * - secondary → trim / secondary colour           (e.g. Chelsea white)
 * - tertiary  → optional third accent             (e.g. cup-kit gold)
 */
export interface ClubBrand {
  primary?: string;
  secondary?: string;
  tertiary?: string;
}

/**
 * A fully-generated scale for one brand colour in a given mode.
 * Components never need to know how these values were derived.
 */
export interface GeneratedColorScale {
  base: string;
  hover: string;
  active: string;
  subtle: string;
  muted: string;
  foreground: string;
}

/**
 * The complete generated palette for one colour mode (light or dark).
 *
 * Brand tokens (primary/secondary/accent) are derived from ClubBrand.
 * Status tokens (success/warning/danger/info) are always independent of brand.
 */
export interface GeneratedPalette {
  // Brand-derived tokens
  primary: GeneratedColorScale;
  secondary: GeneratedColorScale;
  accent: GeneratedColorScale;

  // UI surface / layout tokens
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;

  // Semantic status tokens — never inherit from club brand
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  danger: string;
  dangerForeground: string;
  info: string;
  infoForeground: string;
}

/**
 * The value exposed by the theme context / useTheme() hook.
 */
export interface ThemeContextValue {
  /** The raw user preference — "system" | "light" | "dark". */
  mode: ThemeMode;
  /** The actually-rendered mode — always "light" | "dark". */
  resolvedMode: ResolvedThemeMode;
  /** Update the user's mode preference (persisted to cookie). */
  setMode: (mode: ThemeMode) => void;
  /** The active club's brand colours (empty object = ClubSheet default). */
  brand: ClubBrand;
  /** Update the active brand and persist it for the supplied or stored active club, when available. */
  setBrand: (brand: ClubBrand, clubId?: string) => void;
}

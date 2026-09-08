/**
 * Colour mode — either explicitly set by the user or resolved from the system.
 */
export type ColorMode = "light" | "dark";

/**
 * What the user has actually stored as their preference.
 * "system" means "follow prefers-color-scheme".
 */
export type ColorModePreference = ColorMode | "system";

/**
 * Up to three kit colours a club can define for its dynamic palette.
 * - `primary`   → main brand/kit colour (e.g. Chelsea blue)
 * - `secondary` → accent / trim colour  (e.g. Chelsea white)
 * - `tertiary`  → optional third shade  (e.g. Chelsea gold on cup kits)
 */
export interface KitColors {
  primary: string;
  secondary: string;
  tertiary?: string;
}

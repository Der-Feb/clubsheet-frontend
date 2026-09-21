import type { ClubBrand, ResolvedThemeMode } from "@/types/theme.types";
import { getThemeCssVariables } from "@/lib/palette-generator.utils";

export const ACTIVE_CLUB_STORAGE_KEY = "clubsheet_active_club";
export const ACTIVE_CLUB_COOKIE_NAME = "clubsheet_active_club";
const CLUB_THEME_STORAGE_PREFIX = "clubsheet_brand_";
const CLUB_THEME_COOKIE_PREFIX = "clubsheet_brand_";

export interface StoredClubTheme {
  brand: ClubBrand;
  variables: Record<string, string>;
}

export function getClubThemeStorageKey(clubId: string): string {
  return `${CLUB_THEME_STORAGE_PREFIX}${clubId}`;
}

export function getClubThemeCookieName(clubId: string): string {
  return `${CLUB_THEME_COOKIE_PREFIX}${clubId}`;
}

/**
 * Reads the active club ID from browser storage.
 * Returns `null` outside the browser or when storage is missing or inaccessible.
 */
export function getStoredActiveClubId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(ACTIVE_CLUB_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Persists the active club ID for both client-side restoration and server rendering.
 * Does nothing outside the browser; the cookie is still written if local storage is unavailable.
 */
export function persistActiveClubId(clubId: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ACTIVE_CLUB_STORAGE_KEY, clubId);
  } catch {
    // Storage may be unavailable in privacy-restricted browsers.
  }

  document.cookie = `${ACTIVE_CLUB_COOKIE_NAME}=${encodeURIComponent(clubId)}; max-age=31536000; path=/; SameSite=Lax`;
}

/**
 * Reads a club's cached brand and generated CSS variables from browser storage.
 * Returns `null` when the snapshot cannot be read or lacks the required fields.
 */
export function getStoredClubTheme(clubId: string): StoredClubTheme | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(getClubThemeStorageKey(clubId));
    if (!raw) return null;

    const stored = JSON.parse(raw) as StoredClubTheme;
    if (!stored || typeof stored !== "object" || !stored.brand || !stored.variables) {
      return null;
    }

    return stored;
  } catch {
    return null;
  }
}

export function getStoredClubBrand(clubId: string): ClubBrand | null {
  return getStoredClubTheme(clubId)?.brand || null;
}

/**
 * Caches a club's brand and mode-specific CSS variables for client restoration,
 * and writes the brand to a cookie for server rendering. Does nothing outside the browser.
 */
export function persistClubTheme(
  clubId: string,
  brand: ClubBrand,
  mode: ResolvedThemeMode = "light"
): void {
  if (typeof window === "undefined") return;

  const stored: StoredClubTheme = {
    brand,
    variables: getThemeCssVariables(brand, mode),
  };

  try {
    window.localStorage.setItem(getClubThemeStorageKey(clubId), JSON.stringify(stored));
  } catch {
    // Storage may be unavailable in privacy-restricted browsers.
  }

  document.cookie = `${getClubThemeCookieName(clubId)}=${encodeURIComponent(JSON.stringify(brand))}; max-age=31536000; path=/; SameSite=Lax`;
}

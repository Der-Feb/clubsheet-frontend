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

export function getStoredActiveClubId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(ACTIVE_CLUB_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function persistActiveClubId(clubId: string): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(ACTIVE_CLUB_STORAGE_KEY, clubId);
  } catch {
    // Storage may be unavailable in privacy-restricted browsers.
  }

  document.cookie = `${ACTIVE_CLUB_COOKIE_NAME}=${encodeURIComponent(clubId)}; max-age=31536000; path=/; SameSite=Lax`;
}

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

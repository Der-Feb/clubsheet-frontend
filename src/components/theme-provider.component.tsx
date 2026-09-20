"use client";

import React, { createContext, useEffect, useLayoutEffect, useState, useMemo, useSyncExternalStore } from "react";
import type {
  ThemeMode,
  ResolvedThemeMode,
  ClubBrand,
  ThemeContextValue,
} from "@/types/theme.types";
import { DEFAULT_CLUBSHEET_BRAND } from "@/config/theme.config";
import { applyThemeToElement } from "@/lib/palette-generator.utils";

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_COOKIE_NAME = "clubsheet_theme_mode";
const THEME_BRAND_STORAGE_KEY = "clubsheet_brand";
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getStoredBrand(): ClubBrand | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(THEME_BRAND_STORAGE_KEY);
    if (!stored) return null;

    const brand = JSON.parse(stored) as ClubBrand;
    return brand && typeof brand === "object" ? brand : null;
  } catch {
    return null;
  }
}

// React 18/19 subscription for OS system color scheme (avoids setState in effect)
function subscribeToSystemTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSystemThemeSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getSystemThemeServerSnapshot(): boolean {
  return false;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Initial mode passed from server cookies to prevent SSR mismatch/flash */
  initialMode?: ThemeMode;
  /** Active club brand passed into provider */
  activeBrand?: ClubBrand;
}

export function ThemeProvider({
  children,
  initialMode = "system",
  activeBrand,
}: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const saved = getCookie(THEME_COOKIE_NAME) as ThemeMode | null;
      if (saved && ["system", "light", "dark"].includes(saved)) {
        return saved;
      }
    }
    return initialMode;
  });

  const [brandOverride, setBrandOverride] = useState<ClubBrand | null>(getStoredBrand);

  // Subscribe to OS color-scheme preference via useSyncExternalStore
  const systemIsDark = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    getSystemThemeServerSnapshot
  );

  // Current active brand (derived directly without cascading setState effects)
  const brand = brandOverride || activeBrand || DEFAULT_CLUBSHEET_BRAND;

  // Compute resolved mode ("light" | "dark")
  const resolvedMode: ResolvedThemeMode = useMemo(() => {
    if (mode === "system") {
      return systemIsDark ? "dark" : "light";
    }
    return mode;
  }, [mode, systemIsDark]);

  // Update mode handler (persists to cookie)
  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    setCookie(THEME_COOKIE_NAME, newMode);
  };

  const setBrand = (newBrand: ClubBrand) => {
    setBrandOverride(newBrand);
    try {
      window.localStorage.setItem(THEME_BRAND_STORAGE_KEY, JSON.stringify(newBrand));
    } catch {
      // Storage may be unavailable in privacy-restricted browsers.
    }
  };

  // Apply theme tokens to document root
  useIsomorphicLayoutEffect(() => {
    if (typeof document !== "undefined") {
      applyThemeToElement(document.documentElement, brand, resolvedMode);
    }
  }, [brand, resolvedMode]);

  const contextValue: ThemeContextValue = useMemo(
    () => ({
      mode,
      resolvedMode,
      setMode,
      brand,
      setBrand,
    }),
    [mode, resolvedMode, brand]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

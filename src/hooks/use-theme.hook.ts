"use client";

import { useContext } from "react";
import { ThemeContext } from "@/components/theme-provider.component";
import type { ThemeContextValue } from "@/types/theme.types";

/**
 * Hook to access and manipulate the centralized ClubSheet theme system.
 *
 * Provides:
 * - `mode`: The current preference ('system' | 'light' | 'dark')
 * - `resolvedMode`: The active rendered mode ('light' | 'dark')
 * - `setMode`: Changes and persists theme mode to cookie
 * - `brand`: Current club kit branding colors
 * - `setBrand`: Allows customizing or overriding active kit colors
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }

  return context;
}

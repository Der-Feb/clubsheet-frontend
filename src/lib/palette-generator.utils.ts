import type { ClubBrand, GeneratedPalette, ResolvedThemeMode } from "@/types/theme.types";
import { SEMANTIC_STATUS_COLORS } from "@/config/theme.config";
import {
  normalizeBrandColors,
  generateColorScale,
  getContrastingForeground,
} from "./brand-analyzer.utils";

/**
 * Generates the complete theme palette for a given club brand and color mode.
 */
export function generateThemePalette(
  brand: ClubBrand | undefined,
  mode: ResolvedThemeMode
): GeneratedPalette {
  const normalized = normalizeBrandColors(brand);
  const isDark = mode === "dark";

  // Generate brand scales
  const primaryScale = generateColorScale(normalized.primary, mode);
  const secondaryScale = generateColorScale(normalized.secondary, mode);
  const tertiaryScale = generateColorScale(normalized.tertiary, mode);

  // Status colors
  const statusColors = {
    success: isDark ? SEMANTIC_STATUS_COLORS.success.dark : SEMANTIC_STATUS_COLORS.success.light,
    warning: isDark ? SEMANTIC_STATUS_COLORS.warning.dark : SEMANTIC_STATUS_COLORS.warning.light,
    danger: isDark ? SEMANTIC_STATUS_COLORS.danger.dark : SEMANTIC_STATUS_COLORS.danger.light,
    info: isDark ? SEMANTIC_STATUS_COLORS.info.dark : SEMANTIC_STATUS_COLORS.info.light,
  };

  if (isDark) {
    return {
      primary: primaryScale,
      secondary: secondaryScale,
      accent: tertiaryScale,

      background: "#09090b", // deep rich zinc
      foreground: "#f4f4f5",
      card: "#141417",
      cardForeground: "#f4f4f5",
      popover: "#141417",
      popoverForeground: "#f4f4f5",
      muted: "#27272a",
      mutedForeground: "#a1a1aa",
      border: "#27272a",
      input: "#27272a",
      ring: primaryScale.base,

      success: statusColors.success,
      successForeground: getContrastingForeground(statusColors.success),
      warning: statusColors.warning,
      warningForeground: getContrastingForeground(statusColors.warning),
      danger: statusColors.danger,
      dangerForeground: getContrastingForeground(statusColors.danger),
      info: statusColors.info,
      infoForeground: getContrastingForeground(statusColors.info),
    };
  }

  // Light mode
  return {
    primary: primaryScale,
    secondary: secondaryScale,
    accent: tertiaryScale,

    background: "#ffffff",
    foreground: "#09090b",
    card: "#ffffff",
    cardForeground: "#09090b",
    popover: "#ffffff",
    popoverForeground: "#09090b",
    muted: "#f4f4f5",
    mutedForeground: "#71717a",
    border: "#e4e4e7",
    input: "#e4e4e7",
    ring: primaryScale.base,

    success: statusColors.success,
    successForeground: getContrastingForeground(statusColors.success),
    warning: statusColors.warning,
    warningForeground: getContrastingForeground(statusColors.warning),
    danger: statusColors.danger,
    dangerForeground: getContrastingForeground(statusColors.danger),
    info: statusColors.info,
    infoForeground: getContrastingForeground(statusColors.info),
  };
}

/**
 * Returns a CSS variables dictionary ready to be applied as inline style or document root styles.
 */
export function getThemeCssVariables(
  brand: ClubBrand | undefined,
  mode: ResolvedThemeMode
): Record<string, string> {
  const palette = generateThemePalette(brand, mode);

  return {
    // Primary brand tokens
    "--color-primary": palette.primary.base,
    "--color-primary-hover": palette.primary.hover,
    "--color-primary-active": palette.primary.active,
    "--color-primary-subtle": palette.primary.subtle,
    "--color-primary-muted": palette.primary.muted,
    "--color-primary-foreground": palette.primary.foreground,

    // Secondary & Accent tokens
    "--color-secondary": palette.secondary.base,
    "--color-secondary-hover": palette.secondary.hover,
    "--color-secondary-foreground": palette.secondary.foreground,
    "--color-tertiary": palette.accent.base,
    "--color-tertiary-hover": palette.accent.hover,
    "--color-tertiary-foreground": palette.accent.foreground,
    "--color-accent": palette.accent.base,
    "--color-accent-foreground": palette.accent.foreground,

    // Legacy / semantic utility aliases
    "--color-quaternary": palette.primary.subtle,
    "--color-quinary": palette.primary.muted,

    // UI surface & layout tokens
    "--color-background": palette.background,
    "--color-foreground": palette.foreground,
    "--color-card": palette.card,
    "--color-card-foreground": palette.cardForeground,
    "--color-popover": palette.popover,
    "--color-popover-foreground": palette.popoverForeground,
    "--color-muted": palette.muted,
    "--color-muted-foreground": palette.mutedForeground,
    "--color-border": palette.border,
    "--color-input": palette.input,
    "--color-ring": palette.ring,

    // Semantic status tokens
    "--color-success": palette.success,
    "--color-success-foreground": palette.successForeground,
    "--color-warning": palette.warning,
    "--color-warning-foreground": palette.warningForeground,
    "--color-danger": palette.danger,
    "--color-danger-foreground": palette.dangerForeground,
    "--color-info": palette.info,
    "--color-info-foreground": palette.infoForeground,
  };
}

/**
 * Applies the generated CSS variables directly to a target element (e.g. document.documentElement).
 */
export function applyThemeToElement(
  element: HTMLElement,
  brand: ClubBrand | undefined,
  mode: ResolvedThemeMode
): void {
  const vars = getThemeCssVariables(brand, mode);
  Object.entries(vars).forEach(([key, val]) => {
    element.style.setProperty(key, val);
  });
  element.setAttribute("data-theme", mode);
  if (mode === "dark") {
    element.classList.add("dark");
  } else {
    element.classList.remove("dark");
  }
}

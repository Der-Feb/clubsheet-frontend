import { oklch, formatHex, wcagContrast, clampChroma } from "culori";
import type { ClubBrand, GeneratedColorScale } from "@/types/theme.types";
import { DEFAULT_CLUBSHEET_BRAND } from "@/config/theme.config";

export interface ColorAnalysis {
  hex: string;
  l: number;
  c: number;
  h: number;
  isNeutral: boolean;
  isDark: boolean;
  isLight: boolean;
}

/**
 * Analyzes a single color string in OKLCH color space.
 */
export function analyzeColor(hex: string): ColorAnalysis {
  const parsed = oklch(hex) || oklch(DEFAULT_CLUBSHEET_BRAND.primary || "#005F31")!;
  const l = parsed.l ?? 0.5;
  const c = parsed.c ?? 0.1;
  const h = parsed.h ?? 0;

  return {
    hex: formatHex(parsed) || hex,
    l,
    c,
    h,
    isNeutral: c < 0.04, // Very low chroma = white, black, gray
    isDark: l < 0.4,
    isLight: l > 0.85,
  };
}

/**
 * Returns high-contrast foreground color (either light #ffffff or dark #09090b)
 * ensuring WCAG readability.
 */
export function getContrastingForeground(backgroundHex: string): string {
  const whiteContrast = wcagContrast(backgroundHex, "#ffffff");
  const darkContrast = wcagContrast(backgroundHex, "#09090b");
  return whiteContrast >= darkContrast ? "#ffffff" : "#09090b";
}

/**
 * Normalizes club brand input, automatically generating missing secondary/tertiary colors
 * based on harmonic color relationships and neutrality detection.
 */
export function normalizeBrandColors(brand?: ClubBrand): Required<ClubBrand> {
  const rawPrimary = brand?.primary?.trim();
  const rawSecondary = brand?.secondary?.trim();
  const rawTertiary = brand?.tertiary?.trim();

  // Case 0: No colors supplied -> fallback to ClubSheet default brand
  if (!rawPrimary) {
    return {
      primary: DEFAULT_CLUBSHEET_BRAND.primary!,
      secondary: DEFAULT_CLUBSHEET_BRAND.secondary!,
      tertiary: DEFAULT_CLUBSHEET_BRAND.tertiary!,
    };
  }

  const primaryAnalysis = analyzeColor(rawPrimary);

  // Case 1: Only 1 color supplied -> derive secondary & tertiary harmonically
  if (!rawSecondary) {
    // Secondary: soft complementary or neutral tint
    const secHue = (primaryAnalysis.h + 180) % 360;
    const secColor = clampChroma(
      {
        mode: "oklch",
        l: primaryAnalysis.isDark ? 0.88 : 0.35,
        c: Math.min(primaryAnalysis.c * 0.4, 0.05),
        h: secHue,
      },
      "oklch"
    );

    // Tertiary / accent: triadic or split-complementary vibrant accent
    const tertHue = (primaryAnalysis.h + 45) % 360;
    const tertColor = clampChroma(
      {
        mode: "oklch",
        l: 0.65,
        c: Math.max(primaryAnalysis.c, 0.12),
        h: tertHue,
      },
      "oklch"
    );

    return {
      primary: primaryAnalysis.hex,
      secondary: formatHex(secColor) || "#DFE3DA",
      tertiary: formatHex(tertColor) || "#01562D",
    };
  }

  // Case 2: 2 colors supplied -> analyze and derive tertiary/accent
  if (!rawTertiary) {
    const secondaryAnalysis = analyzeColor(rawSecondary);

    // If secondary is neutral (e.g. white or black in Chelsea/Man Utd),
    // derive a vibrant third kit/accent color (like golden cup trim)
    if (secondaryAnalysis.isNeutral) {
      const tertHue = (primaryAnalysis.h + 35) % 360;
      const tertColor = clampChroma(
        {
          mode: "oklch",
          l: 0.72,
          c: 0.15,
          h: tertHue,
        },
        "oklch"
      );
      return {
        primary: primaryAnalysis.hex,
        secondary: secondaryAnalysis.hex,
        tertiary: formatHex(tertColor) || "#D4AF37",
      };
    }

    // Otherwise derive an analogous accent
    const tertHue = (primaryAnalysis.h + (secondaryAnalysis.h - primaryAnalysis.h) / 2) % 360;
    const tertColor = clampChroma(
      {
        mode: "oklch",
        l: 0.6,
        c: Math.max(primaryAnalysis.c, secondaryAnalysis.c),
        h: tertHue,
      },
      "oklch"
    );

    return {
      primary: primaryAnalysis.hex,
      secondary: secondaryAnalysis.hex,
      tertiary: formatHex(tertColor) || "#01562D",
    };
  }

  // Case 3: All 3 colors supplied
  return {
    primary: analyzeColor(rawPrimary).hex,
    secondary: analyzeColor(rawSecondary).hex,
    tertiary: analyzeColor(rawTertiary).hex,
  };
}

/**
 * Builds a perceptually tuned GeneratedColorScale for a color in light or dark mode.
 */
export function generateColorScale(
  hex: string,
  mode: "light" | "dark"
): GeneratedColorScale {
  const analysis = analyzeColor(hex);
  const isLight = mode === "light";

  if (isLight) {
    // Light mode scale
    const baseColor = formatHex(
      clampChroma(
        {
          mode: "oklch",
          l: Math.min(Math.max(analysis.l, 0.35), 0.65), // keep good contrast for UI actions
          c: analysis.c,
          h: analysis.h,
        },
        "oklch"
      )
    ) || hex;

    const hoverColor = formatHex(
      clampChroma(
        {
          mode: "oklch",
          l: Math.max(analysis.l - 0.08, 0.25),
          c: analysis.c,
          h: analysis.h,
        },
        "oklch"
      )
    ) || baseColor;

    const activeColor = formatHex(
      clampChroma(
        {
          mode: "oklch",
          l: Math.max(analysis.l - 0.14, 0.2),
          c: analysis.c,
          h: analysis.h,
        },
        "oklch"
      )
    ) || hoverColor;

    const subtleColor = formatHex(
      clampChroma(
        {
          mode: "oklch",
          l: 0.96,
          c: Math.min(analysis.c * 0.25, 0.03),
          h: analysis.h,
        },
        "oklch"
      )
    ) || "#f4f4f5";

    const mutedColor = formatHex(
      clampChroma(
        {
          mode: "oklch",
          l: 0.91,
          c: Math.min(analysis.c * 0.35, 0.05),
          h: analysis.h,
        },
        "oklch"
      )
    ) || "#e4e4e7";

    return {
      base: baseColor,
      hover: hoverColor,
      active: activeColor,
      subtle: subtleColor,
      muted: mutedColor,
      foreground: getContrastingForeground(baseColor),
    };
  }

  // Dark mode scale
  // Elevate lightness slightly so brand stands out against deep dark background
  const darkBaseColor = formatHex(
    clampChroma(
      {
        mode: "oklch",
        l: Math.min(Math.max(analysis.l, 0.58), 0.72),
        c: Math.min(analysis.c * 1.05, 0.28),
        h: analysis.h,
      },
      "oklch"
    )
  ) || hex;

  const darkHoverColor = formatHex(
    clampChroma(
      {
        mode: "oklch",
        l: Math.min(analysis.l + 0.08, 0.8),
        c: analysis.c,
        h: analysis.h,
      },
      "oklch"
    )
  ) || darkBaseColor;

  const darkActiveColor = formatHex(
    clampChroma(
      {
        mode: "oklch",
        l: Math.max(analysis.l - 0.06, 0.45),
        c: analysis.c,
        h: analysis.h,
      },
      "oklch"
    )
  ) || darkHoverColor;

  const darkSubtleColor = formatHex(
    clampChroma(
      {
        mode: "oklch",
        l: 0.18,
        c: Math.min(analysis.c * 0.45, 0.05),
        h: analysis.h,
      },
      "oklch"
    )
  ) || "#18181b";

  const darkMutedColor = formatHex(
    clampChroma(
      {
        mode: "oklch",
        l: 0.26,
        c: Math.min(analysis.c * 0.5, 0.07),
        h: analysis.h,
      },
      "oklch"
    )
  ) || "#27272a";

  return {
    base: darkBaseColor,
    hover: darkHoverColor,
    active: darkActiveColor,
    subtle: darkSubtleColor,
    muted: darkMutedColor,
    foreground: getContrastingForeground(darkBaseColor),
  };
}

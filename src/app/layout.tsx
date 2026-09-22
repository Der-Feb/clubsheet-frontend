import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import type { CSSProperties } from "react";
import { ThemeProvider } from "@/components/theme-provider.component";
import { BodyScrollArea } from "@/components/ScrollArea";
import { DARK_MODE_ENABLED, DEFAULT_CLUBSHEET_BRAND } from "@/config/theme.config";
import { MOCK_ACTIVE_CLUB, MOCK_CLUBS } from "@/mocks/clubs.mock";
import { getThemeCssVariables } from "@/lib/palette-generator.utils";
import {
  ACTIVE_CLUB_COOKIE_NAME,
  getClubThemeCookieName,
} from "@/lib/theme-storage.utils";
import type { ClubBrand, ThemeMode } from "@/types/theme.types";
import "./globals.css";
import Providers from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClubSheet - Club Management Platform",
  description: "A modern management platform designed specifically for football clubs and academies",
  icons: {
    icon: DARK_MODE_ENABLED
      ? [
          { url: "/favicon/favicon-light.ico", media: "(prefers-color-scheme: light)" },
          { url: "/favicon/favicon-dark.ico", media: "(prefers-color-scheme: dark)" },
        ]
      : [{ url: "/favicon/favicon-light.ico" }],
  },
};

// Inline script to apply an exact cached palette before hydration when SSR has no club snapshot.
const antiFlashScript = `
(function() {
  try {
    var root = document.documentElement;
    var cookieValue = function(name) {
      var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : null;
    };
    var activeClubId = cookieValue('${ACTIVE_CLUB_COOKIE_NAME}') || window.localStorage.getItem('clubsheet_active_club');
    var serverClubId = root.getAttribute('data-initial-club-id');

    // SSR already used the active club's source-of-truth brand. Only use a browser snapshot when SSR lacked it.
    if (activeClubId && (!serverClubId || serverClubId !== activeClubId)) {
      var storedTheme = window.localStorage.getItem('clubsheet_brand_' + activeClubId);
      var snapshot = storedTheme ? JSON.parse(storedTheme) : null;
      var variables = snapshot && snapshot.variables;
      if (variables && typeof variables === 'object') {
        Object.keys(variables).forEach(function(name) {
          root.style.setProperty(name, variables[name]);
        });
      }
    }

    var match = document.cookie.match(/(?:^|; )clubsheet_theme_mode=([^;]*)/);
    var mode = match ? decodeURIComponent(match[1]) : 'system';
    var darkModeEnabled = ${DARK_MODE_ENABLED};
    var isDark = darkModeEnabled && (mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches));
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawMode = cookieStore.get("clubsheet_theme_mode")?.value;
  const initialMode: ThemeMode =
    rawMode && ["system", "light", "dark"].includes(rawMode)
      ? (rawMode as ThemeMode)
      : "system";
  const storedClubId = cookieStore.get(ACTIVE_CLUB_COOKIE_NAME)?.value;
  const activeClub = MOCK_CLUBS.find((club) => club.id === storedClubId) || MOCK_ACTIVE_CLUB;
  const initialClubId = MOCK_CLUBS.some((club) => club.id === storedClubId)
    ? storedClubId
    : undefined;
  const storedBrand = initialClubId
    ? cookieStore.get(getClubThemeCookieName(initialClubId))?.value
    : undefined;
  let activeBrand: ClubBrand = activeClub.brand || DEFAULT_CLUBSHEET_BRAND;

  if (storedBrand) {
    try {
      activeBrand = JSON.parse(decodeURIComponent(storedBrand)) as ClubBrand;
    } catch {
      // Fall back to the club's API/mock brand when the cached cookie is invalid.
    }
  }

  const initialThemeStyle = getThemeCssVariables(activeBrand, "light") as CSSProperties;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-initial-club-id={initialClubId}
      style={initialThemeStyle}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <BodyScrollArea className="min-h-full flex flex-col overflow-x-hidden bg-background text-foreground">
        <Script
          id="theme-anti-flash"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: antiFlashScript }}
        />
        <Providers>
          <ThemeProvider
            initialMode={initialMode}
            initialClubId={initialClubId}
            activeBrand={activeBrand}
          >
            {children}
          </ThemeProvider>
        </Providers>
      </BodyScrollArea>
    </html>
  );
}

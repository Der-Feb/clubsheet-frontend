import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider.component";
import { DARK_MODE_ENABLED } from "@/config/theme.config";
import type { ThemeMode } from "@/types/theme.types";
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

// Inline script to prevent theme flash (FOUC) before hydration
const antiFlashScript = `
(function() {
  try {
    var root = document.documentElement;
    var setVar = function(name, value) {
      if (value) root.style.setProperty(name, value);
    };
    var applyStoredBrand = function() {
      var storedBrand = window.localStorage.getItem('clubsheet_brand');
      if (!storedBrand) return false;
      var brand = JSON.parse(storedBrand);
      if (!brand || typeof brand !== 'object') return false;

      var primary = brand.primary || '#005F31';
      var secondary = brand.secondary || '#DFE3DA';
      var tertiary = brand.tertiary || primary;

      setVar('--color-primary', primary);
      setVar('--color-primary-hover', primary);
      setVar('--color-primary-active', primary);
      setVar('--color-primary-subtle', 'color-mix(in srgb, ' + primary + ' 6%, white)');
      setVar('--color-primary-muted', 'color-mix(in srgb, ' + primary + ' 10%, white)');
      setVar('--color-primary-foreground', '#ffffff');
      setVar('--color-secondary', secondary);
      setVar('--color-secondary-hover', secondary);
      setVar('--color-secondary-foreground', '#09090b');
      setVar('--color-tertiary', tertiary);
      setVar('--color-tertiary-hover', tertiary);
      setVar('--color-tertiary-foreground', '#ffffff');
      setVar('--color-accent', tertiary);
      setVar('--color-accent-foreground', '#ffffff');
      setVar('--color-quaternary', 'color-mix(in srgb, ' + primary + ' 6%, white)');
      setVar('--color-quinary', 'color-mix(in srgb, ' + primary + ' 10%, white)');
      setVar('--color-ring', primary);
      return true;
    };

    applyStoredBrand();

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

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-background text-foreground">
        <Script
          id="theme-anti-flash"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: antiFlashScript }}
        />
        <Providers>
          <ThemeProvider initialMode={initialMode}>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

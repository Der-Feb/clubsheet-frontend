import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider.component";
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
    icon: [
      { url: "/favicon/favicon-light.ico", media: "(prefers-color-scheme: light)" },
      { url: "/favicon/favicon-dark.ico",  media: "(prefers-color-scheme: dark)"  },
    ],
  },
};

// Inline script to prevent theme flash (FOUC) before hydration
const antiFlashScript = `
(function() {
  try {
    var match = document.cookie.match(/(?:^|; )clubsheet_theme_mode=([^;]*)/);
    var mode = match ? decodeURIComponent(match[1]) : 'system';
    var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
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

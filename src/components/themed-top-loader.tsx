"use client";

import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { DEFAULT_CLUBSHEET_BRAND } from "@/config/theme.config";

export function ThemedTopLoader() {
  const pathname = usePathname();
  const color = pathname.startsWith("/dashboard")
    ? "var(--color-primary)"
    : DEFAULT_CLUBSHEET_BRAND.primary;

  return <NextTopLoader height={3} showSpinner={false} color={color} crawl={false} />;
}

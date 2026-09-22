"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";

export function RouteTopLoaderBridge() {
  const pathname = usePathname();
  const loader = useTopLoader();

  useEffect(() => {
    const currentUrl = window.location.href;
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const startAfterPackageCompletion = (url?: string | URL | null) => {
      const nextUrl = url ? new URL(String(url), currentUrl).href : currentUrl;
      if (nextUrl !== currentUrl) {
        // nextjs-toploader completes its own pushState handler first. Starting
        // on the next frame keeps the bar active until App Router commits.
        window.requestAnimationFrame(() => loader.start());
      }
    };

    window.history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      startAfterPackageCompletion(args[2]);
      return result;
    };

    window.history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);
      startAfterPackageCompletion(args[2]);
      return result;
    };

    const handlePopState = () => loader.start();
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", handlePopState);
    };
  }, [loader]);

  useEffect(() => {
    loader.done(true);
  }, [loader, pathname]);

  return null;
}

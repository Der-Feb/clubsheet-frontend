"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";

export function RouteTopLoaderBridge() {
  const pathname = usePathname();
  const loader = useTopLoader();
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    const currentUrl = window.location.href;
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const startAfterPackageCompletion = (url?: string | URL | null) => {
      const nextUrl = url ? new URL(String(url), currentUrl).href : currentUrl;
      if (nextUrl !== currentUrl) {
        // nextjs-toploader completes its own pushState handler first. Restart
        // immediately so the bar remains active until App Router commits.
        loaderRef.current.start();
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

    const handlePopState = () => loaderRef.current.start();
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    loaderRef.current.done(true);
  }, [pathname]);

  return null;
}

"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failing is non-critical — the site works fine without
      // it, it just won't have the offline/resilience fallback.
    });
  }, []);

  return null;
}

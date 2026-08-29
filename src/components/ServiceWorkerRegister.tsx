"use client";

import { useEffect } from "react";

/**
 * We previously registered a service worker here to add offline resilience.
 * It introduced its own failure mode (net::ERR_CACHE_MISS) that was worse
 * than the problem it was meant to solve, so this component now actively
 * unregisters any existing service worker instead, cleaning up browsers
 * that already installed the old broken version.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });

    if ("caches" in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
    }
  }, []);

  return null;
}

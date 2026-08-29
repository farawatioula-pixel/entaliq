// This service worker previously intercepted requests to add offline
// resilience, but it introduced its own failure mode (visible as
// net::ERR_CACHE_MISS) that was worse than the problem it tried to solve.
// This version does nothing but immediately remove itself and clear
// whatever it previously cached, so browsers that already installed the
// old version get cleaned up automatically.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
    })()
  );
});

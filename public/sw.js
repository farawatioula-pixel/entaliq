// Basic resilience service worker.
//
// What this does: for page navigations and same-origin GET requests, try the
// network first. If it fails, or takes longer than NETWORK_TIMEOUT_MS, fall
// back to whatever was last successfully cached for that exact URL. Every
// successful network response updates the cache, so the "last good version"
// is always what gets served when the network hiccups.
//
// What this does NOT do: work on the very first visit to a page (nothing is
// cached yet), or make POST/auth/data-mutating requests succeed offline —
// those need a live server by definition, no cache can substitute for them.

const CACHE_NAME = "intaleq-resilience-v1";
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle same-origin GET requests. Never intercept POST/PUT/etc
  // (logins, form submissions, order actions) — those must always hit the
  // real network, a cached response would be actively wrong.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Don't cache Supabase-bound API calls or anything under /api — those
  // need fresh data every time, never a stale cached copy.
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        const networkResponse = await withTimeout(fetch(request), NETWORK_TIMEOUT_MS);
        // Only cache successful, complete responses.
        if (networkResponse && networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        // Nothing cached and the network failed — nothing we can do,
        // let the browser show its normal offline/connection error.
        throw new Error("No cached response available and network failed");
      }
    })()
  );
});

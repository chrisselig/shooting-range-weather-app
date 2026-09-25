// Minimal service worker: no offline caching, exists only to satisfy the
// browser's PWA installability requirement (a fetch handler + activation).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});

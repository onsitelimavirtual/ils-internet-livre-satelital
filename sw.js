const CACHE_NAME = "ils-v7.0.1-chart-wifi-20261126";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./favicon-64.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE_NAME);
  await Promise.allSettled(CORE.map(async path => { try { const response = await fetch(path, {cache:"reload"}); if (response.ok) await cache.put(path, response); } catch (_) {} }));
  await self.skipWaiting();
})()));
self.addEventListener("activate", event => event.waitUntil((async () => { await Promise.all((await caches.keys()).filter(name => name.startsWith("ils-") && name !== CACHE_NAME).map(name => caches.delete(name)));
  await self.clients.claim(); })()));
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate" || url.pathname.endsWith("/index.html")) {
    event.respondWith((async () => { try { const response = await fetch(request, {cache:"no-store"}); if (response.ok) { const cache = await caches.open(CACHE_NAME); cache.put("./index.html", response.clone()).catch(()=>{}); } return response; } catch (_) { return await caches.match(request) || await caches.match("./index.html") || new Response("ILS indisponível offline", {status:503}); } })());
    return;
  }
  event.respondWith((async () => { const cached = await caches.match(request); if (cached) return cached; try { const response = await fetch(request); if (response.ok) { const cache = await caches.open(CACHE_NAME); cache.put(request, response.clone()).catch(()=>{}); } return response; } catch (_) { return new Response("Recurso indisponível offline", {status:503}); } })());
});

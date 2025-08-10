// This is an updated service worker for PWA functionality

const CACHE_NAME = "glossycare-v2"; // Update version when logo or manifest changes
const urlsToCache = ["/", "/index.html", "/styles/globals.css"]; // Removed manifest.json from static cache

// Install a service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
  // Force immediate activation if instructed
  self.skipWaiting();
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Use network-first strategy for manifest and logo
  if (
    url.pathname === "/manifest.json" ||
    url.href.includes("firebasestorage.googleapis.com/v0/b/glossy-64fb8.firebasestorage.app/o/1.png")
  ) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
    );
    return;
  }

  // Cache-first strategy for other resources
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Update a service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim clients immediately to apply updates
  self.clients.claim();
});

// Handle messages from client (e.g., SKIP_WAITING)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
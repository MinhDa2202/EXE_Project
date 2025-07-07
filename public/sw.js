"use strict";

import { getTranslationPaths } from "../src/Functions/helper";

// Variables
const CACHE_NAME = "e-commerce-v9";
const ASSETS = [
  "/",
  "/index.html",
  ...getTranslationPaths(["en", "ar", "fr", "hl", "hu", "ja", "ru"]),
];

// Functions
async function cacheAssets() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(ASSETS);

  clearOldCaches();
}

async function handleFetchAndCache(request) {
  const cacheResponse = await caches.match(request);

  try {
    // Handle cross-origin requests (like Cloudinary images)
    if (request.url.startsWith('http') && new URL(request.url).origin !== self.location.origin) {
      return fetch(request);
    }

    const networkResponse = await fetch(request);

    if (request.method !== 'GET') {
      return networkResponse;
    }

    if (!networkResponse.ok) {
      throw new Error(`Network response not ok: ${networkResponse.status}`);
    }

    const shouldSkipCache = networkResponse.url.includes("chrome-extension");

    if (shouldSkipCache) return networkResponse;

    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, networkResponse.clone());

    return networkResponse;
  } catch (err) {
    console.error("Fetch failed:", err);
    return cacheResponse || new Response(null, { status: 500, statusText: 'Fetch failed' }); // Return cached response or a generic error response
  }
}

async function updateCachedAssets() {
  const cache = await caches.open(CACHE_NAME);

  try {
    const responses = await Promise.all(
      ASSETS.map(async (asset) => {
        const fetchedResponse = await fetch(asset);

        if (fetchedResponse.ok) {
          await cache.put(asset, fetchedResponse.clone());
        }

        return fetchedResponse;
      })
    );

    return responses;
  } catch (error) {
    console.error("Failed to update cache:", error);
  }
}

async function clearOldCaches() {
  const cacheKeys = await caches.keys();

  await Promise.all(
    cacheKeys
      .filter((key) => key !== CACHE_NAME)
      .map((key) => caches.delete(key))
  );
}

// Events
self.addEventListener("install", (event) => {
  event.waitUntil(cacheAssets());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(updateCachedAssets());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(handleFetchAndCache(event.request));
});

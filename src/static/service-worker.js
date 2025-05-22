// Service Worker for ML Explorer's Journey
// Enables offline functionality and resource caching

const CACHE_NAME = 'ml-explorer-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/translations.js',
  '/static/js/main.js',
  '/static/js/code-editor.js',
  '/static/js/ai-assistant.js',
  '/static/js/offline.js',
  '/static/images/logo.png',
  '/static/images/chapter1.jpg',
  '/static/images/resource_basics.jpg',
  '/static/images/resource_preprocessing.jpg',
  '/static/images/resource_decision_trees.jpg',
  '/static/data/magical_creatures.csv'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request - request can only be used once
        const fetchRequest = event.request.clone();
        
        // Try network, then cache response for future
        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response - response can only be used once
            const responseToCache = response.clone();
            
            // Cache the fetched resource
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(error => {
            // Network failed, show offline page for HTML requests
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            // Just propagate the error for other resources
            throw error;
          });
      })
  );
});

// Handle background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Function to sync data with server
function syncData() {
  // In a real app, this would retrieve data from IndexedDB and send to server
  console.log('Background sync triggered');
  
  // Return a promise that resolves when sync is complete
  return Promise.resolve();
}

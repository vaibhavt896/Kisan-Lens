// Agri-Sage Service Worker for offline functionality

const CACHE_NAME = 'agri-sage-v1.0.0';
const STATIC_CACHE_NAME = 'agri-sage-static-v1.0.0';

// Assets to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  // Add any TensorFlow.js model files here when integrated
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS.filter(url => {
          // Only cache assets that exist
          return fetch(url, { method: 'HEAD' })
            .then(() => true)
            .catch(() => false);
        }));
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle API requests (network first, cache fallback)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request);
        })
    );
    return;
  }
  
  // Handle static assets (cache first, network fallback)
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image' ||
      url.pathname.includes('/static/')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              // Cache the fetched resource
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            });
        })
    );
    return;
  }
  
  // Handle navigation requests (network first with cache fallback)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match('/');
        })
    );
    return;
  }
  
  // Default: try network first, then cache
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Background sync for offline actions (future enhancement)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-diagnosis') {
    event.waitUntil(
      // Handle offline diagnosis queue
      syncOfflineDiagnoses()
    );
  }
});

// Handle offline diagnosis queue (placeholder for future implementation)
async function syncOfflineDiagnoses() {
  console.log('[SW] Syncing offline diagnoses...');
  // This would handle any diagnoses made while offline
  // and sync them when connectivity returns
  return Promise.resolve();
}

// Push notification handling (future enhancement)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  if (event.data) {
    const notificationData = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(notificationData.title, {
        body: notificationData.body,
        icon: '/manifest-icon-192.png',
        badge: '/manifest-icon-192.png',
        tag: 'agri-sage-notification',
        requireInteraction: true,
        actions: [
          {
            action: 'open-app',
            title: 'Open Agri-Sage'
          }
        ]
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open-app' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
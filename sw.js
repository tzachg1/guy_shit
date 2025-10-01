const CACHE_NAME = 'ga-strategy-v1.0.0';
const STATIC_CACHE = 'ga-strategy-static-v1.0.0';
const DYNAMIC_CACHE = 'ga-strategy-dynamic-v1.0.0';

const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/logo.png',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files:', error);
            })
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    if (request.method !== 'GET') {
        return;
    }
    
    if (url.origin !== location.origin && !isAllowedExternalResource(url)) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache:', request.url);
                    return cachedResponse;
                }
                
                return fetch(request)
                    .then(networkResponse => {
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        if (shouldCacheDynamically(request)) {
                            const responseClone = networkResponse.clone();
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => {
                                    console.log('Service Worker: Caching dynamic resource:', request.url);
                                    cache.put(request, responseClone);
                                });
                        }
                        
                        return networkResponse;
                    })
                    .catch(error => {
                        console.error('Service Worker: Network request failed:', error);
                        
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        return new Response('Offline - Resource not available', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

function isAllowedExternalResource(url) {
    const allowedDomains = [
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'cdnjs.cloudflare.com'
    ];
    
    return allowedDomains.some(domain => url.hostname.includes(domain));
}

function shouldCacheDynamically(request) {
    const url = new URL(request.url);
    
    const staticExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.woff', '.woff2', '.ttf'];
    const hasStaticExtension = staticExtensions.some(ext => url.pathname.endsWith(ext));
    
    const isAllowedExternal = isAllowedExternalResource(url);
    
    return hasStaticExtension || isAllowedExternal;
}

self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    try {
        const db = await openIndexedDB();
        const pendingForms = await getPendingForms(db);
        
        for (const formData of pendingForms) {
            try {
                await sendPendingForm(formData);
                await removePendingForm(db, formData.id);
                console.log('Service Worker: Successfully synced form submission');
            } catch (error) {
                console.error('Service Worker: Failed to sync form submission:', error);
            }
        }
    } catch (error) {
        console.error('Service Worker: Error during form sync:', error);
    }
}

function openIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('GAStrategyDB', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('pendingForms')) {
                db.createObjectStore('pendingForms', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

function getPendingForms(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['pendingForms'], 'readonly');
        const store = transaction.objectStore('pendingForms');
        const request = store.getAll();
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });
}

function removePendingForm(db, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['pendingForms'], 'readwrite');
        const store = transaction.objectStore('pendingForms');
        const request = store.delete(id);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
}

async function sendPendingForm(formData) {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to send form');
    }
    
    return response;
}

self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New message from G.A Strategy Business & Growth',
        icon: '/logo.png',
        badge: '/logo.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('G.A Strategy Business & Growth', options)
    );
});

self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});

console.log('Service Worker: Loaded successfully');

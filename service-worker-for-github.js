// Service Worker for Push Notifications
// Hosted on GitHub Pages to avoid Salesforce redirect issues
// This service worker handles push notifications for mobile app registration

const CACHE_NAME = 'robo-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/s/',
    '/sfsites/c/',
    '/sfsites/c/resource/'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker caching app shell and content');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Service Worker deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// Fetch event - serve from cache, then network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Push notification event
self.addEventListener('push', event => {
    console.log('Push notification received:', event);

    const data = event.data ? JSON.parse(event.data.text()) : {};
    const title = data.title || 'New Notification';
    const body = data.body || 'You have a new notification';
    const icon = data.icon || 'https://robotrading.my.site.com/sfsites/c/resource/notificationIcon.svg';
    const badge = data.badge || 'https://robotrading.my.site.com/sfsites/c/resource/notificationBadge.svg';

    const options = {
        body: body,
        icon: icon,
        badge: badge,
        data: data,
        requireInteraction: false,
        vibrate: [200, 100, 200],
        tag: 'robo-notification-' + Date.now()
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked:', event);

    event.notification.close();
    event.waitUntil(
        clients.matchAll({type: 'window', includeUncontrolled: true}).then(clients => {
            if (clients.length > 0) {
                clients[0].focus();
            } else {
                // If no client is open, open a new one
                return clients.openWindow('/');
            }
        })
    );
});

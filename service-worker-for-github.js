// Service Worker for Push Notifications
// Hosted on GitHub Pages for reference - actual registration uses blob-based approach in LWC
// This service worker handles push notifications for mobile app registration

const CACHE_NAME = 'robo-pwa-cache-v1';
const urlsToCache = ['/', '/s/', '/sfsites/c/', '/sfsites/c/resource/'];

self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(Promise.all([
        self.clients.claim(),
        caches.keys().then(cacheNames => Promise.all(cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })))
    ]));
});

self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});

self.addEventListener('push', event => {
    const data = event.data ? JSON.parse(event.data.text()) : {};
    const options = {
        body: data.body || 'You have a new notification',
        icon: data.icon || 'https://robotrading.my.site.com/sfsites/c/resource/notificationIcon.svg',
        badge: data.badge || 'https://robotrading.my.site.com/sfsites/c/resource/notificationBadge.svg',
        data: data,
        requireInteraction: false,
        vibrate: [200, 100, 200],
        tag: 'robo-notification-' + Date.now()
    };
    event.waitUntil(self.registration.showNotification(data.title || 'New Notification', options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(clients.matchAll({type: 'window', includeUncontrolled: true}).then(clients => {
        if (clients.length > 0) clients[0].focus();
    }));
});

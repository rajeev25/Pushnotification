// Service Worker for Push Notifications
// Hosted on GitHub Pages to avoid Salesforce redirect issues
 
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});
 
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(self.clients.claim());
});
 
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
 
    event.waitUntil(self.registration.showNotification(title, options));
});
 
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked:', event);
    event.notification.close();
    event.waitUntil(clients.matchAll({type: 'window', includeUncontrolled: true}).then(clients => {
        if (clients.length > 0) {
            clients[0].focus();
        }
    }));
});

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/teacher.png'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('push', function(event) {
  var payload = event.data ? event.data.text() : '{}';
  var notification = JSON.parse(payload).notification;
  event.waitUntil(
    self.registration.showNotification(notification.title, notification)
  );
});

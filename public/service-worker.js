self.addEventListener('push', function(event) {
  var payload = event.data ? event.data.text() : '{}';
  var notification = JSON.parse(payload).notification;
  event.waitUntil(
    self.registration.showNotification(notification.title, notification)
  );
});

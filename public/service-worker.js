self.addEventListener('push', function(event) {
  try {
    var payload = event.data.text();
    var notification = JSON.parse(payload).notification;
    event.waitUntil(
      self.registration.showNotification(notification.title, notification)
    );
  } catch (error) {
    console.log(error);
  }
});

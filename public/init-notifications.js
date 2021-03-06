function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
function requestPermission () {
  if (!('serviceWorker' in navigator || !('PushManager' in window))) {
    console.log('service worker or push apis are not supported in this browser');
    return;
  }
  console.log('support confirmed');
}
function registerServiceWorker() {
  return navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
      console.log('Service worker successfully registered.');
      return registration;
    })
    .catch(function(err) {
      console.error('Unable to register service worker.', err);
    });
}
function askPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
  .then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('We were not granted permission.');
    }
  });
}
function getApiPublicKey() {
  return fetch('/api/notification-public-key/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Bad status code from server.');
    }
    return response.json();
  })
}
function subscribeUserToPush(config) {
  return navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(config.publicKey),
      };

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function(pushSubscription) {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
      return pushSubscription;
    });
}
function sendSubscriptionToBackEnd(subscription) {
  return fetch('/api/save-subscription/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error('Bad status code from server.');
    }

    return response.json();
  })
  .then(function(responseData) {
    if (!(responseData.data && responseData.data.success)) {
      throw new Error('Bad response from server.');
    }
  });
}
requestPermission();
registerServiceWorker();
askPermission()
  .then(getApiPublicKey)
  .then(subscribeUserToPush)
  .then(sendSubscriptionToBackEnd);

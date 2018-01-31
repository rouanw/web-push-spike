const nconf = require('nconf');
const Express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const Promise = require('bluebird');
const db = require('./db');
const initPush = require('./push');

nconf.file('.env.json');
const publicKey = nconf.get('publicKey');
const privateKey = nconf.get('privateKey');

webpush.setVapidDetails(
  'http://example.org',
  publicKey,
  privateKey,
);

const push = initPush(webpush);

const app = Express();
app.use(bodyParser.json());
app.use(Express.static('public'))

const isValidSaveRequest = (req, res, next) => {
  // Check the request body has at least an endpoint.
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription.
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint.'
      }
    }));
  }
  return next();
};

app.get('/api/notification-public-key/', (req, res) => res.send({ publicKey }));

app.post('/api/save-subscription/', isValidSaveRequest, function (req, res) {
  return db.saveSubscription(req.body)
    .then(function(subscriptionId) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ data: { success: true } }));
    })
    .catch(function(err) {
      res.status(500);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        error: {
          id: 'unable-to-save-subscription',
          message: 'The subscription was received but we were unable to save it to our database.'
        }
      }));
    });
});

app.post('/example/notify', function(req, res) {
  const dataToSend = {
    notification: {
      title: 'Ahoy!',
      body: 'Call me Ishmael',
      icon: '/teacher.png',
    },
  };
  return db.getSubscriptions()
    .then(function(subscriptions) {
      return Promise.map(subscriptions, (subscription) => push.triggerMessage(subscription, JSON.stringify(dataToSend)))
        .then(() => res.sendStatus(200));
    });
});

db.init()
  .then(() => app.listen(3000))
  .then(() => console.log('Listening'));

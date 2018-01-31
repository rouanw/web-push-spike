const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'web_notifications';
 
let db;

const init = () =>
  MongoClient.connect(url)
    .then((client) => {
      db = client.db(dbName);
      return;
    });

const saveSubscription = (subscription) =>
  db.collection('subscriptions')
    .update({ endpoint: subscription.endpoint }, { subscription }, { upsert: true });

const getSubscriptions = () => db.collection('subscriptions').find({}).toArray();

module.exports = {
  init,
  saveSubscription,
  getSubscriptions,
};

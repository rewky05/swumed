const admin = require('firebase-admin');
const serviceAccount = require('./swumed-afb7e-firebase-adminsdk-rlp9u-d82355ce41.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://swumed-afb7e-default-rtdb.firebaseio.com/'
});

module.exports = admin;

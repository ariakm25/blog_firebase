const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebase = require("firebase");

const cors = require("cors")

admin.initializeApp(functions.config().firebase);
var config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  storageBucket: process.env.storageBucket,
};
firebase.initializeApp(config);

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

const users_route = require('./routes/users.routes');
const posts_route = require('./routes/posts.routes');

app.use('/user', users_route);
app.use('/post', posts_route);

exports.app = functions.https.onRequest(app);

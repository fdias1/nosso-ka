const functions = require('firebase-functions');
const cors = require('cors')
var admin = require("firebase-admin");
var serviceAccount = require("./serviceKey.json");
const env = 'prod'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nosso-ka.firebaseio.com"
});

const express = require('express')
const database = admin.firestore()
const routes = require('./routes')(database,env)

const app = express()
app.use(cors({origin:true}))
app.use(express.json())
app.use(routes)

exports.app = functions.https.onRequest(app)

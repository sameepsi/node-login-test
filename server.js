//to load config from file
require('./config/config');

const express = require('express');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');
const TwitterStrategy  = require('passport-twitter').Strategy;
const session = require('express-session');
const passport = require('passport');

const {routes} = require('./api/routes/route')

require('./db/mongoose');

const port = process.env.PORT;

var app=express();
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

//initialize passport
app.use(passport.initialize());

//using express session for twitter dependencies
app.use(session({
  secret: 'test secret',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.session());

app.use(bodyParser.json());

//register all the login routes
routes(app);

app.listen(port,()=>{
  console.log(`Started on port ${port}`);
})

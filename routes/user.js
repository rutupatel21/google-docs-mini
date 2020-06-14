var express = require("express");
var mongoose = require("mongoose");
var path = require('path');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose =	require("passport-local-mongoose");
var bodyParser = require("body-parser");
var app = express.Router();
var User = require("./../models/user");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/docs");

app.use(require('cookie-parser')());
app.use(require("express-session")({
	secret: "Rusty is a dog",
	resave: false,
	saveUninitialized: false
}));

exports.home = function (req, res) {
    res.render('home', { title: 'Home page of google docs mini' });
};

exports.signup = function (req, res) {
    res.render('signup', { title: 'Please Sign up' });
};

exports.register = function (req, res) {
  var userdetails = new User({
    username: req.body.username,
    password: req.body.password
  });
  userdetails.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully!');
  });
  res.render('secret', { title: 'Secret page' });
};

exports.login = function (req, res) {
    res.render('login', { title: 'Please log in' });
};

exports.loginUser = function (req, res) {
    //res.render('login', { title: 'Please log in' });
    app.use(passport.initialize());
    app.use(passport.session());
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/secret');
    }
};

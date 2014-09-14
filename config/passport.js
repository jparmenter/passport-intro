var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function(passport) {

  // passport session setup
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.model.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // local setup
  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {

    process.nextTick(function() {
      User.registerLocal(email, password, function(err, newUser) {
        if (err) {
          return done(null, false, req.flash('signupMessage', err));
        }
        else {
          return done(null, newUser);
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    User.authenticateWithLocal(email, password, function(err, user) {
      if (err) {
        return done(null, false, req.flash('loginMessage', err));
      }
      else {
        return done(null, user);
      }
    });
  }));

  // facebook setup
  passport.use(new FacebookStrategy({
    clientID : configAuth.facebookAuth.clientID,
    clientSecret : configAuth.facebookAuth.clientSecret,
    callbackURL : configAuth.facebookAuth.callbackURL
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findByFacebookId(profile.id, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        }
        else {
          User.registerFacebook(profile.id, profile.token, profile.name + ' ' + profile.name.familyName, function(err, newUser) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    })
  }));
};

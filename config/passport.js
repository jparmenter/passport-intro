var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
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
    callbackURL : configAuth.facebookAuth.callbackURL,
    passReqToCallback : true
  },
  function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if (!req.user) {
        User.findByFacebookId(profile.id, function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            if (!user.facebook.token) {
              user.facebook.token = token;
              user.facebook.name = profile.name.givenName + ' ' + profile.name.displayName;
              user.facebook.email = profile.emails[0].value;
              user.save(function(err) {
                if (err)
                  throw err;
                return done(null, user);
              });
            }
          }
          else {
            User.registerFacebook(profile.id, profile.token, profile.name.givenName + ' ' + profile.name.familyName, profile.emails[0].value, function(err, newUser) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      }
      else {
        User.addFacebookToUser(req.user, profile.id, token, profile.name.givenName + ' ' + profile.name.familyName, profile.emails[0].value, function(err, user) {
          if (err) {
            throw err;
          }
          return done(null, user);
        });
      }
    });
  }));

  // Twitter setup
  passport.use(new TwitterStrategy({
    consumerKey : configAuth.twitterAuth.consumerKey,
    consumerSecret : configAuth.twitterAuth.consumerSecret,
    callbackURL : configAuth.twitterAuth.callbackURL,
    passReqToCallback : true
  },
  function(req, token, tokenSecret, profile, done) {
    process.nextTick(function() {
      if (!req.user) {
        User.findByTwitterId(profile.id, function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            if (!user.twitter.token) {
              user.twitter.token = token;
              user.twitter.username = profile.username;
              user.twitter.displayName = profile.displayName;
              user.save(function(err) {
                if (err)
                  throw err;
                return done(null, user);
              });
            }
          }
          else {
            User.registerTwitter(profile.id, token, profile.username, profile.displayName, function(err, newUser) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      }
      else {
        User.addTwitterToUser(req.user, profile.id, token, profile.username, profile.displayName, function(err, user) {
          if (err) {
            throw err;
          }
          return done(null, user);
        });
      }
    });
  }));

  passport.use(new GoogleStrategy({
    clientID : configAuth.googleAuth.clientID,
    clientSecret : configAuth.googleAuth.clientSecret,
    callbackURL : configAuth.googleAuth.callbackURL,
    passReqToCallback : true
  },
  function(req, token, refreshToken, profile, done) {
    process.nextTick(function() {
      if (!req.user) {
        User.findByGoogleId(profile.id, function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            if (!user.google.token) {
              user.google.token = token;
              user.google.name = profile.displayName;
              user.google.email = profile.emails[0].value;
              user.save(function(err) {
                if (err)
                  throw err;
                return done(null, user);
              });
            }
          }
          else {
            User.registerGoogle(profile.id, token, profile.emails[0].value, profile.displayName, function(err, newUser) {
              if (err) {
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      }
      else {
        User.addGoogleToUser(req.user, profile.id, token, profile.emails[0].value, profile.displayName, function(err, user) {
          if (err) {
            throw err;
          }
          return done(null, user);
        });
      }
    });
  }));
};

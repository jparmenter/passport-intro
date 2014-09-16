var User = require('../app/models/user');

module.exports = function(app, passport) {

  app.get('/', function(req, res, next) {
    if (!req.isAuthenticated())
      return next();
    res.redirect('/profile');
  },
  function(req, res) {
    res.render('pages/index.ejs');
  });

  app.get('/login', function(req, res) {
    res.render('pages/login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  }));

  app.get('/signup', function(req, res) {
    res.render('pages/signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  app.get('/unlink/local', function(req, res) {
    var user = req.user;
    User.clearLocal(user, function(err) {
      res.redirect('/profile');
    });
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('pages/profile.ejs', {
      user : req.user
    });
  });


  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // facebook routes
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  // twitter routes
  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  // google routes
  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  // Authorize

  // local
  app.get('/connect/local', function(req, res) {
    res.render('pages/connect-local.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/connect/local',
    failureFlash : true
  }));

  //f facebook
  app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

  app.get('connect/facebook/callback',
    passport.authorize('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  app.get('/unlink/facebook', function(req, res) {
    var user = req.user;
    User.clearFacebook(user, function(err) {
      res.redirect('/profile');
    });
  });

  // twitter
  app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

  app.get('/connect/twitter/callback',
    passport.authorize('twitter', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  app.get('/unlink/twitter', function(req, res) {
    var user = req.user;
    User.clearTwitter(user, function(err) {
      res.redirect('/profile');
    });
  });

  // google
  app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

  app.get('/connect/google/callback',
    passport.authorize('google', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  app.get('/unlink/google', function(req, res) {
    var user = req.user;
    User.clearGoogle(user, function(err) {
      res.redirect('/profile');
    });
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

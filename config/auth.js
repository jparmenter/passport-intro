var settings = require('./settings');

module.exports = {
  'facebookAuth' : {
    'clientID' : settings.fbClientId,
    'clientSecret' : settings.fbClientSecret,
    'callbackURL' : 'http://localhost:3000/auth/facebook/callback'
  },
  'twitterAuth' : {
    'consumerKey' : settings.tKey,
    'consumerSecret' : settings.tSecret,
    'callbackURL' : 'http://localhost:3000/auth/twitter/callback'
  }
}

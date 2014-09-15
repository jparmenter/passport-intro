var User = function() {
  var mongoose = require('mongoose');
  var bcrypt = require('bcrypt-nodejs');
  var userSchema = mongoose.Schema({
    local : {
      email : String,
      password : String
    },
    facebook : {
      id : String,
      token : String,
      email : String,
      name : String
    },
    twitter : {
      id : String,
      token : String,
      displayName : String,
      username : String
    },
    google : {
      id : String,
      token : String,
      email : String,
      name : String
    }
  });

  userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
  };

  var _model = mongoose.model('User', userSchema);

  // Local methods
  var _findByLocalEmail = function(email, callback) {
    _model.findOne({ 'local.email' : email }, callback);
  }

  var _registerLocal = function(email, password, callback) {
    _findByLocalEmail(email, function(err, user) {
      if (user) {
        callback("The email is already taken", null);
      }
      else {
        var newUser = new _model();
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);
        newUser.save(function(err) {
          if (err) {
            callback(err, null);
          }
          else {
            callback(null, newUser);
          }
        });
      }
    });
  }

  var _authenticateWithLocal = function(email, password, callback) {
    _findByLocalEmail(email, function(err, user) {
      if (!user) {
        callback('No user found.', null);
      }
      else if (!user.validPassword(password)) {
        callback('Oops! wrong password', null);
      }
      else {
        callback(null, user);
      }
    });
  }

  var _clearLocal = function(user, callback) {
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      callback(err);
    });
  }

  // Facebook methods
  var _findByFacebookId = function(id, callback) {
    _model.findOne({ 'facebook.id' : id }, callback);
  }

  var _registerFacebook = function(id, token, name, email, callback) {
    _findByFacebookId(id, function(err, user) {
      if (user) {
        callback("Facebook user already registered");
      }
      else {
        var newUser = new _model();
        newUser.facebook.id = id;
        newUser.facebook.token = token;
        newUser.facebook.name = name;
        newUser.facebook.email = email;
        newUser.save(function(err) {
          if (err) {
            callback(err, null);
          }
          else {
            callback(null, newUser);
          }
        });
      }
    });
  }

  var _addFacebookToUser = function(user, id, token, name, email, callback) {
    if (!user) {
      callback("Need a user");
    }
    else {
      user.facebook.id =id;
      user.facebook.token = token;
      user.facebook.name = name;
      user.facebook.email = email;
      user.save(function(err) {
        if (err) {
          throw err;
        }
        else {
          callback(null, user);
        }
      });
    }
  }

  var _clearFacebook = function(user, callback) {
    user.facebook.token = undefined;
    user.save(function(err) {
      callback(err);
    });
  }

  // Twitter methods
  var _findByTwitterId = function(id, callback) {
    _model.findOne({ 'twitter.id' : id }, callback);
  }

  var _registerTwitter = function(id, token, username, displayName, callback) {
    _findByTwitterId(id, function(err, user) {
      if (user) {
        callback("Twitter user already registered");
      }
      else {
        var newUser = new _model();
        newUser.twitter.id = id;
        newUser.twitter.token = token;
        newUser.twitter.username = username;
        newUser.twitter.displayName = displayName;
        newUser.save(function(err) {
          if (err) {
            callback(err, null);
          }
          else {
            callback(null, newUser);
          }
        });
      }
    });
  }

  var _addTwitterToUser = function(user, id, token, username, displayName, callback) {
    if (!user) {
      callback("Need a user");
    }
    else {
      user.twitter.id =id;
      user.twitter.token = token;
      user.twitter.username = username;
      user.twitter.displayName = displayName;
      user.save(function(err) {
        if (err) {
          throw err;
        }
        else {
          callback(null, user);
        }
      });
    }
  }

  var _clearTwitter = function(user, callback) {
    user.twitter.token = undefined;
    user.save(function(err) {
      callback(err);
    });
  }

  // Google methods
  var _findByGoogleId = function(id, callback) {
    _model.findOne({ 'google.id' : id }, callback);
  }

  var _registerGoogle = function(id, token, email, name, callback) {
    _findByGoogleId(id, function(err, user) {
      if (user) {
        callback("Google user already registered");
      }
      else {
        var newUser = new _model();
        newUser.google.id = id;
        newUser.google.token = token;
        newUser.google.email = email;
        newUser.google.name = name;
        newUser.save(function(err) {
          if (err) {
            callback(err, null);
          }
          else {
            callback(null, newUser);
          }
        });
      }
    });
  }

  var _addGoogleToUser = function(user, id, token, email, name, callback) {
    if (!user) {
      callback("Need a user");
    }
    else {
      user.google.id =id;
      user.google.token = token;
      user.google.name = name;
      user.google.email = email;
      user.save(function(err) {
        if (err) {
          throw err;
        }
        else {
          callback(null, user);
        }
      });
    }
  }

  var _clearGoogle = function(user, callback) {
    user.google.token = undefined;
    user.save(function(err) {
      callback(err);
    });
  }

  return {
    registerLocal : _registerLocal,
    authenticateWithLocal : _authenticateWithLocal,
    clearLocal : _clearLocal,
    findByFacebookId : _findByFacebookId,
    registerFacebook : _registerFacebook,
    clearFacebook : _clearFacebook,
    addFacebookToUser : _addFacebookToUser,
    findByTwitterId : _findByTwitterId,
    registerTwitter : _registerTwitter,
    addTwitterToUser : _addTwitterToUser,
    clearTwitter : _clearTwitter,
    findByGoogleId : _findByGoogleId,
    registerGoogle : _registerGoogle,
    addGoogleToUser : _addGoogleToUser,
    clearGoogle : _clearGoogle,
    schema : userSchema,
    model : _model,
  }
}();

module.exports = User;

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

  // Facebook methods
  var _findByFacebookId = function(id, callback) {
    _model.findOne({ 'facebook.id' : id }, callback);
  }

  var _registerFacebook = function(id, token, name, email, callback) {
    _findByFacebookId(id, function(err, user) {
      if (user) {
        callback("Facebook email already registered");
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

  return {
    registerLocal : _registerLocal,
    authenticateWithLocal : _authenticateWithLocal,
    findByFacebookId : _findByFacebookId,
    registerFacebook : _registerFacebook,
    schema : userSchema,
    model : _model,
  }
}();

module.exports = User;

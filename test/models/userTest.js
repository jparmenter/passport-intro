var mongoose = require("mongoose");
var User = require("../../app/models/user");
var should = require("chai").should();
var expect = require("chai").expect;
mongoose.connect("mongodb://localhost/passport-intro_test");

describe("Users", function() {

  var currentUser = null;

  afterEach(function(done) {
    User.model.remove({}, function() {
      done();
    });
  });

  describe("local", function() {
    beforeEach(function(done) {
      User.registerLocal("test@test.com", "password", function(err, user) {
        currentUser = user;
        done();
      });
    });

    describe("register", function() {
      it("should create a new user", function(done) {
        User.registerLocal("test2@test.com", "password", function(err, user) {
          user.local.email.should.equal("test2@test.com");
          done();
        });
      });

      it("should not register user with existing email", function(done) {
        User.registerLocal("test@test.com", "password", function(err, user) {
          expect(user).to.be.null;
          err.should.equal("The email is already taken");
          done();
        });
      });

    });

    describe("authenticate", function() {
      it("should return a user after being authenticated", function(done) {
        User.authenticateWithLocal("test@test.com", "password", function(err, user) {
          expect(err).to.be.null;
          expect(user.local.email).equal(currentUser.local.email);
          done();
        });
      });

      it("should give an error when email is not found", function(done) {
        User.authenticateWithLocal("test2@test.com", "password", function(err, user) {
          expect(user).to.be.null;
          expect(err).to.equal('No user found.');
          done();
        });
      });

      it("should give an error when password is incorrect", function(done) {
        User.authenticateWithLocal("test@test.com", "password2", function(err, user) {
          expect(user).to.be.null;
          expect(err).to.equal("Oops! wrong password");
          done();
        });
      });
    });
  });

  describe("facebook", function() {
    beforeEach(function(done) {
      User.registerFacebook("1234", "token001", "Joe Doe", "facebook@test.com", function(err, user) {
        currentUser = user;
        done();
      });
    });

    describe("register", function() {
      it("should create a new user", function(done) {
        User.registerFacebook("1235", currentUser.facebook.token, currentUser.facebook.token, currentUser.facebook.token.email, function(err, user) {
          user.should.exist;
          done();
        });
      });

      it("should not create a new user", function(done) {
        User.registerFacebook("1234", "token555", "Bob Doe", "bobdoe@test.com", function(err, user) {
          err.should.equal("Facebook user already registered");
          done();
        });
      });
    });

    describe("find by id", function() {
      it("should return a user", function(done) {
        User.findByFacebookId(currentUser.facebook.id, function(err, user) {
          user.facebook.id.should.equal(currentUser.facebook.id);
          done();
        });
      });

      it("should id is not found", function(done) {
        User.findByFacebookId("0000", function(err, user) {
          expect(user).to.be.null;
          done();
        });
      });
    });
  });

  describe("twitter", function() {
    beforeEach(function(done) {
      User.registerTwitter("1234", "xyz", "tuser", "Twitter User", function(err, user) {
        currentUser = user;
        done();
      });
    });

    describe("register", function() {
      it("should create a new user", function(done) {
        User.registerTwitter("1235", currentUser.twitter.token, currentUser.twitter.username, currentUser.twitter.displayName, function(err, user) {
          user.should.exist;
          done();
        });
      });

      it("should not create a new user", function(done) {
        User.registerTwitter(currentUser.twitter.id, currentUser.twitter.token, currentUser.twitter.user, currentUser.twitter.displayName, function(err, user) {
          err.should.equal("Twitter user already registered");
          done();
        });
      });
    });

    describe("find by id", function() {
      it("should find current user by id", function(done) {
        User.findByTwitterId(currentUser.twitter.id, function(err, user) {
          user.twitter.username.should.equal(currentUser.twitter.username);
          done();
        });
      });

      it("should retun null when id is not found", function(done) {
        User.findByTwitterId("12345", function(err, user) {
          expect(user).to.be.null;
          done();
        })
      })
    })
  });

  describe("google", function() {
    beforeEach(function(done) {
      User.registerGoogle("1234", "xyz", "guser", "Google User", function(err, user) {
        currentUser = user;
        done();
      });
    });

    describe("register", function() {
      it("should create a user", function(done) {
        User.registerGoogle("0001", currentUser.google.token, currentUser.google.email, currentUser.google.name, function(err, user) {
          user.google.name.should.equal(currentUser.google.name);
          done();
        });
      });

      it("should have a unique id", function(done) {
        User.registerGoogle(currentUser.google.id, currentUser.google.token, currentUser.google.email, currentUser.google.name, function(err, user) {
          err.should.equal("Google user already registered");
          // - expect(user).to.be.null; /undefined?
          done();
        });
      });
    });

    describe("find by id", function() {
      it("should find current user by id", function(done) {
        User.findByGoogleId(currentUser.google.id, function(err, user) {
          user.google.email.should.equal(currentUser.google.email);
          done();
        });
      });

      it("should not find a user id that doesn't exist", function(done) {
        User.findByGoogleId("0001", function(err, user) {
          expect(user).to.be.null;
          done();
        })
      })
    })
  });
});

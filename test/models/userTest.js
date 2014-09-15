var mongoose = require("mongoose");
var User = require("../../app/models/user");
var should = require("chai").should();
var expect = require("chai").expect;
mongoose.connect("mongodb://localhost/passport-intro_test");

describe("Users", function() {

  var currentUser = null;

  beforeEach(function(done) {
    User.registerLocal("test@test.com", "password", function(err, user) {
      currentUser = user;
      done();
    });
  });

  afterEach(function(done) {
    User.model.remove({}, function() {
      done();
    });
  });

  describe("local", function() {

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

    describe("clear data", function() {
      it("should have undefined properties", function(done) {
        User.clearLocal(currentUser, function(err) {
          expect(currentUser.local.email).to.be.undefined;
          done();
        });
      });
    });
  });

  describe("facebook", function() {
    var fbUser = null;

    beforeEach(function(done) {
      User.registerFacebook("1234", "token001", "Joe Doe", "facebook@test.com", function(err, user) {
        fbUser = user;
        done();
      });
    });

    describe("register", function() {
      it("should create a new user", function(done) {
        User.registerFacebook("1235", fbUser.facebook.token, fbUser.facebook.token, fbUser.facebook.token.email, function(err, user) {
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
        User.findByFacebookId(fbUser.facebook.id, function(err, user) {
          user.facebook.id.should.equal(fbUser.facebook.id);
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


    describe("add to user", function() {
      it("should add a fb user to the currentUser", function(done) {
        User.addFacebookToUser(currentUser, fbUser.facebook.id, fbUser.facebook.token, fbUser.facebook.name, fbUser.facebook.email, function(err, user) {
          user.should.exist;
          done();
        });
      });
    });

    describe("clear data", function() {
      it("should have undefined properties", function(done) {
        User.clearFacebook(fbUser, function(err) {
          expect(fbUser.facebook.token).to.be.undefined;
          done();
        });
      });
    });
  });

  describe("twitter", function() {
    var tUser = null
    beforeEach(function(done) {
      User.registerTwitter("1234", "xyz", "tuser", "Twitter User", function(err, user) {
        tUser = user;
        done();
      });
    });

    describe("register", function() {
      it("should create a new user", function(done) {
        User.registerTwitter("1235", tUser.twitter.token, tUser.twitter.username, tUser.twitter.displayName, function(err, user) {
          user.should.exist;
          done();
        });
      });

      it("should not create a new user", function(done) {
        User.registerTwitter(tUser.twitter.id, tUser.twitter.token, tUser.twitter.user, tUser.twitter.displayName, function(err, user) {
          err.should.equal("Twitter user already registered");
          done();
        });
      });
    });

    describe("find by id", function() {
      it("should find current user by id", function(done) {
        User.findByTwitterId(tUser.twitter.id, function(err, user) {
          user.twitter.username.should.equal(tUser.twitter.username);
          done();
        });
      });

      it("should retun null when id is not found", function(done) {
        User.findByTwitterId("12345", function(err, user) {
          expect(user).to.be.null;
          done();
        });
      });
    });

    describe("add to user", function() {
      it("should add twitter user to the currentUser", function(done) {
        User.addTwitterToUser(currentUser, tUser.twitter.id, tUser.twitter.token, tUser.twitter.username, tUser.twitter.displayName, function(err, user) {
          user.should.exist;
          done();
        })
      });
    });

    describe("clear data", function() {
      it("should have undefined properties", function(done) {
        User.clearTwitter(tUser, function(err) {
          expect(tUser.twitter.token).to.be.undefined;
          done();
        });
      });
    });
  });

  describe("google", function() {
    var gUser = null;
    beforeEach(function(done) {
      User.registerGoogle("1234", "xyz", "guser", "Google User", function(err, user) {
        gUser = user;
        done();
      });
    });

    describe("register", function() {
      it("should create a user", function(done) {
        User.registerGoogle("0001", gUser.google.token, gUser.google.email, gUser.google.name, function(err, user) {
          user.google.name.should.equal(gUser.google.name);
          done();
        });
      });

      it("should have a unique id", function(done) {
        User.registerGoogle(gUser.google.id, gUser.google.token, gUser.google.email, gUser.google.name, function(err, user) {
          err.should.equal("Google user already registered");
          // - expect(user).to.be.null; /undefined?
          done();
        });
      });
    });

    describe("find by id", function() {
      it("should find current user by id", function(done) {
        User.findByGoogleId(gUser.google.id, function(err, user) {
          user.google.email.should.equal(gUser.google.email);
          done();
        });
      });

      it("should not find a user id that doesn't exist", function(done) {
        User.findByGoogleId("0001", function(err, user) {
          expect(user).to.be.null;
          done();
        });
      });
    });

    describe("add to user", function() {
      it("should add google user to the currentUser", function(done) {
        User.addGoogleToUser(currentUser, gUser.google.id, gUser.google.token, gUser.google.email, gUser.google.name, function(err, user) {
          user.should.exist;
          done();
        });
      });
    });

    describe("clear data", function() {
      it("should have undefined properties", function(done) {
        User.clearGoogle(gUser, function(err) {
          expect(gUser.google.token).to.be.undefined;
          done();
        });
      });
    });
  });
});

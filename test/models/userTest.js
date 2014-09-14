var mongoose = require("mongoose");
var User = require("../../app/models/user");
var should = require("chai").should();
var expect = require("chai").expect;
mongoose.connect("mongodb://localhost/passport-intro_test");

describe("Users", function() {

  var currentUser = null;

  describe("local", function() {
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
        currentUser = user.facebook;
        done();
      });
    });

    afterEach(function(done) {
      User.model.remove({}, function() {
        done();
      });
    });

    describe("register", function() {
      it("should create a new user", function(done) {
        User.registerFacebook("1235", currentUser.token, currentUser.token, currentUser.token.email, function(err, user) {
          user.should.exist;
          done();
        });
      });

      it("should not create a new user", function(done) {
        User.registerFacebook("1234", "token555", "Bob Doe", "bobdoe@test.com", function(err, user) {
          err.should.equal("Facebook email already registered");
          done();
        });
      });
    });

    describe("findByFacebookId", function() {
      it("should return a user", function(done) {
        User.findByFacebookId(currentUser.id, function(err, user) {
          user.facebook.id.should.equal(currentUser.id);
          done();
        });
      });

      it("should id is not found", function() {
        User.findByFacebookId("0000", function(err, user) {
          expect(user).to.be.null;
        });
      });
    });
  });
});

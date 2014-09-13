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

    describe("find by email", function() {
      it("should find our currentUser", function(done) {
        User.findByLocalEmail("test@test.com", function(err, user) {
          expect(user.local.email).equal(currentUser.local.email);
          done();
        });
      });

      it("should not find a user that does not exist", function(done) {
        User.findByLocalEmail("test3@test.com", function(err, user) {
          expect(user).to.be.null;
          expect(err).to.be.null;
          done();
        })
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
});

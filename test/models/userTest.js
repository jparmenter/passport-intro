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
    it("registers a new user", function(done) {
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

    it("should find our currentUser", function(done) {
      User.findByLocalEmail("test@test.com", function(err, user) {
        user.should.exist;
        expect(user.local.email).equal(currentUser.local.email);
        done();
      });
    });

    it("should not find a customer that does not exist", function(done) {
      User.findByLocalEmail("test3@test.com", function(err, user) {
        expect(user).to.be.null;
        expect(err).to.be.null;
        done();
      })
    });
  });  
});

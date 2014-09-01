var assert = require('assert');
var appModule = rootRequire('app');
var http = require('http');
var User = rootRequire('app/models/User');
var bcrypt = require('bcrypt');

describe('authentication', function(){
  before(function(done){
    User.sync({force: true}).success(function(){
      done();
    });
  });

  describe('signup', function(){
    it('accepts signup requests with a username and password and creates new users', function(done){
      var request = http.request({
        method: 'POST',
        path: '/signup?email=will@ahfr.org&password=Gargantuan1&name=Will',
        port: appModule.port
      }, function(response){
        assert(response.statusCode === 200, "status code not 200/OK");

        User.find({
          where: {
            email: 'will@ahfr.org'
          }
        }).done(function(error,user){
          assert(user.name === "Will");

          done();
        });
      });

      request.end();
    });

    it('doesn\'t store the password in the clear', function(done){
      var request = http.request({
        method: 'POST',
        path: '/signup?email=villain@ahfr.org&password=plaintextPassword&name=AnotherUser',
        port: appModule.port
      }, function(response){
        User.find({
          where: {
            email: 'villain@ahfr.org'
          }
        }).done(function(error,user){
          assert(user.password && user.password !== "plaintextPassword");

          done();
        });
      });

      request.end();
    });

    it('accepts plaintext passwords and matches them against hashed passwords', function(done){
      var request = http.request({
        method: 'POST',
        path: '/signup?email=user@ahfr.org&password=userpassword&name=YetAnotherUser',
        port: appModule.port
      }, function(response){
        User.find({
          where: {
            email: 'user@ahfr.org'
          }
        }).done(function(error,user){
          bcrypt.compare('userpassword', user.password, function(error, bcryptResponse){
            assert(bcryptResponse === true);

            done();
          });
        });
      });

      request.end();
    });
  });
});

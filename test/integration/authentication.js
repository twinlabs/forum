var assert = require('assert');
var _ = require('lodash');
var appModule = rootRequire('app');
var http = require('http');
var User = rootRequire('app/models/User');

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
        path: '/signup',
        port: appModule.port,
        headers: {
          'Content-Type': 'application/json'
        }
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

      request.write(JSON.stringify({
        name: 'Will',
        email: 'will@ahfr.org',
        password: 'Gargantuan1'
      }));

      request.end();
    });

    it('doesn\'t store the password in the clear', function(done){
      var request = http.request({
        method: 'POST',
        path: '/signup',
        port: appModule.port,
        headers: {
          'Content-Type': 'application/json'
        }
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

      request.write(JSON.stringify({
        name: 'AnotherUser',
        email: 'villain@ahfr.org',
        password: 'plaintextPassword'
      }));

      request.end();
    });

    it('accepts plaintext passwords and matches them against hashed passwords', function(done){
      var request = http.request({
        method: 'POST',
        path: '/signup',
        port: appModule.port,
        headers: {
          'Content-Type': 'application/json'
        }
      }, function(response){
        User.find({
          where: {
            email: 'user@ahfr.org'
          }
        }).done(function(error,user){
          user.isValidPassword('userpassword', function(error, passwordResponse){
            assert(passwordResponse === true);

            done();
          });
        });
      });

      request.write(JSON.stringify({
        name: 'YetAnotherUser',
        email: 'user@ahfr.org',
        password: 'userpassword'
      }));

      request.end();
    });
  });

  describe('login', function(){
    it('retrieves stored users based on a given username and password', function(done){
      var signupRequest = http.request({
        method: 'POST',
        path: '/signup',
        port: appModule.port,
        headers: {
          'Content-Type': 'application/json'
        }
      }, function(response){
        response.resume();

        var userData = JSON.stringify({
          email: 'retrievableuser@ahfr.org',
          password: 'retrievableuserpassword'
        });

        var headers =  {
          'Content-Type': 'application/json; charset=UTF-8',
          'Content-Length': userData.length
        };

        var loginRequest = http.request({
          method: 'POST',
          path: '/login',
          port: appModule.port,
          headers: headers
        }, function(response){
          response.resume();

          assert(response.statusCode === 200, "status code not 200/OK: " + response.statusCode);
          done();
        });

        loginRequest.write(userData);
        loginRequest.end();
      });

      signupRequest.write(JSON.stringify({
        name: 'TheBestGuy',
        email: 'retrievableuser@ahfr.org',
        password: 'retrievableuserpassword'
      }));

      signupRequest.end();
    });

    it('create a session for an authenticated user', function(done){
      var signupRequest = http.request({
        method: 'POST',
        path: '/signup',
        port: appModule.port,
        headers: {
          'Content-Type': 'application/json'
        }
      }, function(response){
        response.resume();

        var userData = JSON.stringify({
          email: 'sessioneduser@ahfr.org',
          password: 'password'
        });

        var headers =  {
          'Content-Type': 'application/json; charset=UTF-8',
          'Content-Length': userData.length
        };

        var loginRequest = http.request({
          method: 'POST',
          path: '/login',
          port: appModule.port,
          headers: headers
        }, function(response){
          assert(response.statusCode === 200, "status code not 200/OK: " + response.statusCode);
          sessioncookie = response.headers['set-cookie'] && _.find(response.headers['set-cookie'], function(cookie){
            return cookie.match(/^connect.sid/) !== null;
          });

          assert(sessioncookie !== undefined, 'session cookie not undefined: ' + sessioncookie);

          done();
        });

        loginRequest.write(userData);
        loginRequest.end();
      });

      signupRequest.write(JSON.stringify({
        name: 'CoolSessionedUser',
        email: 'sessioneduser@ahfr.org',
        password: 'password'
      }));

      signupRequest.end();
    });
  });
});

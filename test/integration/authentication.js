var assert = require('assert');
var fs = require('fs');
var _ = require('lodash');
var appModule = rootRequire('app');
var http = require('http');
var request = require('request');
var User = rootRequire('models/User');

describe('authentication', function(){
  before(function(done){
    User.sync({force: true}).then(function(){
      done();
    });
  });

  describe('signup', function(){
    it('accepts signup requests with a username and password and correct token, resulting in the creation of a new user', function(done){
      request.post({
        url: 'http://localhost:' + appModule.port + '/signup',
        formData: {
          name: 'Will',
          email: 'will@ahfr.org',
          password: 'Gargantuan1',
          token: fs.createReadStream(__dirname + '/../fixtures/duck.jpg')
        }
      }, function(error, response, body){
        if (error) {
          return console.error('upload failed: ', error);
        }

        assert(response.statusCode === 302, "status code not 302: " + response.statusCode);

        User.findOne({
          where: {
            email: 'will@ahfr.org'
          }
        }).then(function(user){
          assert(user.name === "Will");

          done();
        });
      });
    });

    it('blocks signup when the token is wrong or not passed, given the environment has configured a particular signup token', function(done){
      request.post({
        url: 'http://localhost:' + appModule.port + '/signup',
        formData: {
          name: 'improperly tokened user',
          email: 'untokeneduser@ahfr.org',
          password: 'userpassword',
          token: fs.createReadStream(__dirname + '/../fixtures/boredcat.jpg')
        }
      }, function(error, response, body){
        if (error) {
          return console.error('upload failed: ', error);
        }

        assert(response.statusCode === 401, 'expected 401, but response was actually ' + response.statusCode);

        done();
      });
    });

    it('doesn\'t store the password in the clear', function(done){
      request.post({
        url: 'http://localhost:' + appModule.port + '/signup',
        formData: {
          name: 'AnotherUser',
          email: 'villain@ahfr.org',
          password: 'plaintextPassword',
          token: fs.createReadStream(__dirname + '/../fixtures/duck.jpg')
        }
      }, function(error, response, body){
        User.findOne({
          where: {
            email: 'villain@ahfr.org'
          }
        }).then(function(user){
          assert(user.password && user.password !== "plaintextPassword");

          done();
        });
      });
    });

    it('accepts plaintext passwords and matches them against hashed passwords', function(done){
      request.post({
        url: 'http://localhost:' + appModule.port + '/signup',
        formData: {
          name: 'YetAnotherUser',
          email: 'user@ahfr.org',
          password: 'userpassword',
          token: fs.createReadStream(__dirname + '/../fixtures/duck.jpg')
        }
      }, function(error, response, body){
        User.findOne({
          where: {
            email: 'user@ahfr.org'
          }
        }).then(function(user){
          user.isValidPassword('userpassword', function(error, passwordResponse){
            assert(passwordResponse === true);

            done();
          });
        });
      });
    });
  });

  describe('login', function(){
    it('retrieves stored users based on a given username and password', function(done){
      request.post({
        url: 'http://localhost:' + appModule.port + '/signup',
        formData: {
          name: 'TheBestGuy',
          email: 'retrievableuser@ahfr.org',
          password: 'retrievableuserpassword',
          token: fs.createReadStream(__dirname + '/../fixtures/duck.jpg')
        }
      }, function(error, response, body){
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

          assert(response.statusCode === 302, "status code not 200/OK: " + response.statusCode);
          done();
        });

        loginRequest.write(userData);
        loginRequest.end();
      });
    });

    it('create a session for an authenticated user', function(done){
      request.post({
        url: 'http://localhost:' + appModule.port + '/signup',
        formData: {
          name: 'CoolSessionedUser',
          email: 'sessioneduser@ahfr.org',
          password: 'password',
          token: fs.createReadStream(__dirname + '/../fixtures/duck.jpg')
        }
      }, function(error, response, body){
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
          assert(response.statusCode === 302, "status code not 200/OK: " + response.statusCode);
          var sessioncookie = response.headers['set-cookie'] && _.find(response.headers['set-cookie'], function(cookie){
            return cookie.match(/^connect.sid/) !== null;
          });

          assert(sessioncookie !== undefined, 'session cookie not undefined: ' + sessioncookie);

          done();
        });

        loginRequest.write(userData);
        loginRequest.end();
      });
    });
  });
});

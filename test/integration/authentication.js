var assert = require('assert');
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
  });
});

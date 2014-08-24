var assert = require('assert');
var User = rootRequire('app/models/User');

describe('models/User.js', function(){
  it('has a name', function(){
    var user = User.build({
      // instance attributes go here...
      name: 'will high'
    });


    assert(user.get('name') === 'will high');
  });

  it('adds a validation error for a user name less than one character', function() {
    var user = User.build({
      name: ''
    });
    assert(user.validate() && user.validate().name.length > 0);
  });

  it('adds a validation error for a user name greater than than 30 characters', function() {
    var user = User.build({
      name: 'critique of pure reason, critique of pure will'
    });
    assert(user.validate() && user.validate().name.length > 0);
  });
});

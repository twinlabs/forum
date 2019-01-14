var assert = require('assert');
var user = rootRequire('models/User');

describe('models/User.js', function() {
  it('has a name', function() {
    var userInstance = user.build({
      // instance attributes go here...
      name: 'will high',
    });

    assert(userInstance.get('name') === 'will high');
  });

  it('adds a validation error for a user name less than one character', function(done) {
    var userInstance = user.build({
      name: '',
    });

    userInstance.validate().catch(function(error) {
      assert.equal(error.errors[0].path, 'name');

      done();
    });
  });

  it('adds a validation error for a user name greater than than 30 characters', function(done) {
    var userInstance = user.build({
      name: 'critique of pure reason, critique of pure will',
    });

    userInstance.validate().catch(function(error) {
      assert.equal(error.errors[0].path, 'name');

      done();
    });
  });
});

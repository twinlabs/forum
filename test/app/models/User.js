var assert = require('assert');
var User = rootRequire('app/models/User');

describe('models/User.js', function(){
  it('has a name', function(){
    var user = User.build({
      // instance attributes go here...
    });

    assert(user.get('name') === "will high");
  });
});

var assert = require('assert');
var Post = rootRequire('app/models/Post');
var User = rootRequire('app/models/User');

var models = {
  Post: Post,
  User: User
};


describe('User', function(){
  before(function(){
    Post.associate(models);
    User.associate(models);
  });

  it('can ask for posts', function(){
    var user = User.build({
      name: 'Ty',
      id: 1
    });

    assert(typeof user.getPosts === "function");
  });

  xit('gets posts associated with a particular user', function(){
    // note: I wish associations worked with in-memory model instances.
    // if we can get those to work, we can move the identically-named
    // test out of the integration test module...
  });
});

var assert = require('assert');
var post = rootRequire('models/Post');
var user = rootRequire('models/User');

var models = {
  post: post,
  user: user
};


describe('User', function(){
  before(function(){
    post.associate(models);
    user.associate(models);
  });

  it('can ask for posts', function(){
    var userInstance = user.build({
      name: 'Ty',
      id: 1
    });

    assert(typeof userInstance.getPosts === "function");
  });

  xit('gets posts associated with a particular user', function(){
    // note: I wish associations worked with in-memory model instances.
    // if we can get those to work, we can move the identically-named
    // test out of the integration test module...
  });
});

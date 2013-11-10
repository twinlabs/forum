var assert = require('assert');
var sinon = require('sinon');
require('../../../rootRequire');
var User = rootRequire('/app/models/User');
var Post = rootRequire('/app/models/Post');

describe('models/User.js', function(){
  before(function(){
    global.session = {
      user: 'test user'
    };
  });

  after(function(){
    delete global.session;
  });

  it('exists', function(){
    assert(User, "'User' model specified doesn't exist");
  });

  it('can have an array of posts...', function(){
    var POSTS_SIZE = 5;
    var user = new User();

    assert(user.posts.length === 0, "newly-initialized user doesn't have an empty collection of posts");
    for (var i = 0; i < POSTS_SIZE; i++){
      user.posts.push(new Post());
    }

    assert(user.posts.length === POSTS_SIZE, "user doesn't have the number of posts expected");
  });

  it('has an ID...', function(){
    var user = new User();

    assert(typeof user.id !== "undefined", "user doesn't have an ID attribute");
  });

  it('has a default displayname', function(){
    var user = new User();

    assert(user.displayName === user.name, "user's displayname is different from expected");
  });
});

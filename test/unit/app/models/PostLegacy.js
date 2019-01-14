var assert = require('assert');
var sinon = require('sinon');
var test = require('sinon-test')(sinon);
sinon.test = test;
var Post = rootRequire('models/PostLegacy');

describe('models/PostLegacy.js', function() {
  var TEST_USER = {
    name: 'James Heintschel',
    id: 555,
  };

  before(function() {
    global.session = {
      user: TEST_USER,
    };
  });

  after(function() {
    delete global.session;
  });

  it('exists', function() {
    assert(Post, "'Post' model specified doesn't exist");
  });

  it('knows its "className"', function() {
    assert(
      Post.prototype.className === 'Post',
      'Post className is not as expected',
    );
  });

  it('uses prototypes appropriately (sanity check)', function() {
    assert(
      new Post().className === 'Post',
      'Post instance className is not as expected',
    );
  });

  it('creates a new ID for each post...', function() {
    var post = new Post();
    var anotherPost = new Post();
    assert(post.id !== anotherPost.id, 'post IDs were unexpectedly equal');
  });

  it('uses "parent" to refer to another post', function() {
    var parentPost = new Post();
    var childPost = new Post(parentPost);
    var descendantPost = new Post(childPost);
    assert(
      childPost.parent === parentPost,
      'childPost.parent should refer to parentPost',
    );
    assert(
      descendantPost.parent.parent === parentPost,
      'descendantPost.parent.parent should refer to parentPost',
    );
  });

  it('finds posts by ID', function() {
    var parentPost = new Post();
    var childPost = new Post(parentPost);

    assert(Post.findOne(childPost.id) === childPost);
  });

  it("associates posts with the session's user", function() {
    var post = new Post();
    assert(
      post.userid === TEST_USER.id,
      'user associated with post not as expected',
    );
  });
});

// this is all well and good, but sequelize is going to do 99.99% of this for us.
// the code isn't worth too much any more...

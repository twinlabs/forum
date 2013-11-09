var assert = require('assert');
var sinon = require('sinon');
require('../../../rootRequire');
var Post = rootRequire('/app/models/post');

describe('models/Post.js', function(){
  it('exists', function(){
    assert(Post, "'Post' model specified doesn't exist");
  });

  it('knows its "className"', function(){
    assert(Post.prototype.className === 'Post', "Post className is not as expected");
  });

  it('uses prototypes appropriately (sanity check)', function(){
    assert(new Post().className === 'Post', "Post instance className is not as expected");
  });

  it('has an "id" attribute in a particular format', function(){
    var post = new Post();
    assert(typeof post.id !== "undefined", "Post instance does not have an ID attribute");
    assert(post.id.match(/post_[0-9]+/), "Post identifier not in the format expected");
  });

  it('creates a new ID for each post...', function(){
    var post = new Post();
    var anotherPost = new Post();
    assert(post.id !== anotherPost.id, "post IDs were unexpectedly equal");
  });

  it('has a "parent" attribute', function(){
    var post = new Post();
    assert(typeof new Post().parent !== "undefined", "Post instance does not have a parent attribute");
  });

  it('uses "parent" to refer to another post', function(){
    var parentPost = new Post();
    var childPost = new Post(parentPost);
    var descendantPost = new Post(childPost);
    assert(childPost.parent === parentPost, "childPost.parent should refer to parentPost");
    assert(descendantPost.parent.parent === parentPost, "descendantPost.parent.parent should refer to parentPost");
  });

  it('finds posts by ID', function(){
    var parentPost = new Post();
    var childPost = new Post(parentPost);

    assert(Post.find(childPost.id) === childPost);
  });
});

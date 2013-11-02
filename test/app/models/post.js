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
});

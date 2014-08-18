var assert = require('assert');
var Post = rootRequire('app/models/Post');

describe('models/Post.js', function(){
  it('exists', function(){
    assert(Post);
  });

  it('has a body', function(){
    var post = Post.build({
      body: "yes"
    });
  });

  it('can have a parent...', function(){
    var originalPost = Post.build({
      body: 'parent post',
      id: 1
    });

    var secondaryPost = Post.build({
      body: 'gee, that original post sure was interesting...',
      parent: 1
    });

    assert(secondaryPost.getParent);
  });
});

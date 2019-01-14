var assert = require('assert');
var Post = rootRequire('models/Post');

describe('models/Post.js', function() {
  it('has a body', function() {
    var BODY_CONTENT = 'hello world';

    var post = Post.build({
      body: BODY_CONTENT,
    });

    assert(post.get('body') === BODY_CONTENT);
  });

  it('can have a parent...', function() {
    var originalPost = Post.build({
      body: 'parent post',
      id: 1,
    });

    var secondaryPost = Post.build({
      body: 'gee, that original post sure was interesting...',
      parent: 1,
    });

    assert(secondaryPost.getParent);
  });
});

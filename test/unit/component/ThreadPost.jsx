var TestUtils = require('react-addons-test-utils');
var React = require('react');
var assert = require('assert');

var Post = require('../../../v2/app/components/ThreadPost.jsx');

describe('ThreadPost', function() {
  it('exists', function() {
    var renderedPost = TestUtils.renderIntoDocument(<Post body={'_hello_'} />);
    assert(renderedPost);
  });
});

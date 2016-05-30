var React = require('react');
var ReactDOM = require('react-dom');
var Post = require('./Post.jsx');

var Posts = React.createClass({
  render: function() {
    return (
      <div className="postsContainer">
        {this.props.posts.map(Post)}
      </div>
    );
  }
});


module.exports = Posts;


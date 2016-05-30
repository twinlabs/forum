var React = require('react');
var ReactDOM = require('react-dom');

var Post = React.createClass({
  render: function() {
    return (
      <div className="post">
        {this.props.title}
        {this.props.replyCount} Replies
        {this.props.lastreply.user.name}
        {this.props.lastreply.created_at}!!!
      </div>
    )
  }
});

module.exports = function(postData) {
  return (
    <Post
      key={postData.id}
      {...postData}
    />
  );
}

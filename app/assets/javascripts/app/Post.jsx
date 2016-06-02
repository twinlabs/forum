var React = require('react');
var ReactDOM = require('react-dom');
var Preify = require('./Preify.jsx');

var Post = React.createClass({
  render: function() {
    return (
      <div className="post">
        <Preify>
          {JSON.stringify(this.props)}
        </Preify>
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

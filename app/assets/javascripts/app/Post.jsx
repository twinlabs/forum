var React = require('react');
var ReactDOM = require('react-dom');

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

var Preify = React.createClass({
  render: function() {
    return (
      <pre className="preify">
        {this.props.children}
      </pre>
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

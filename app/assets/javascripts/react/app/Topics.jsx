var React = require('react');
var ReactDOM = require('react-dom');
var Topic = require('./Topic.jsx');

var Topics = React.createClass({
  render: function() {
    return (
      <div className="topicsContainer">
        {this.props.topics.map(Topic)}
      </div>
    );
  }
});


module.exports = Topics;


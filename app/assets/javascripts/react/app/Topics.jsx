var _ = require('lodash/core');
var React = require('react');
var ReactDOM = require('react-dom');
var Topic = require('./Topic.jsx');

var Topics = React.createClass({
  render: function() {
    return (
      <div className="topicsContainer">
        {_.filter(this.props.value.topics, function(topic) {
          return !topic.parent;
         }).map(Topic)}
      </div>
    );
  }
});


module.exports = Topics;


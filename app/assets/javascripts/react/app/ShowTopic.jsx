var _ = require('lodash/core');
var React = require('react');
var ReactDOM = require('react-dom');
var Topic = require('./Topic.jsx');

module.exports = React.createClass({
  render: function() {
    var topicData = _.find(this.props.value.topics, {
      id: parseInt(this.props.routeParams.id, 10)
    });

    return (
      <Topic {...topicData} />
    );
  }
});

var _ = require('lodash/core');
var React = require('react');
var ReactDOM = require('react-dom');
var Thread = require('./Thread.jsx');

module.exports = React.createClass({
  render: function() {
    var topicData = _.find(this.props.value.topics, {
      id: parseInt(this.props.routeParams.id, 10)
    });

    return (
      <Thread
        {...topicData}
        posts={_.filter(this.props.value.topics,
          {
            parent: parseInt(this.props.routeParams.id, 10)
          }
        ).reverse()}
      />
    );
  }
});

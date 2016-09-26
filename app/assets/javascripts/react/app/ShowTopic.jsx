var _ = require('lodash/core');
var React = require('react');
var ReactDOM = require('react-dom');
var Thread = require('./Thread.jsx');
var superagent = require('superagent');

module.exports = React.createClass({
  componentWillMount: function() {
    superagent.get(`/topic/${parseInt(this.props.routeParams.id, 10)}`)
      .set('Accept', 'application/json')
      .then(function(response){
        window.store.dispatch({
          type: 'INITIALIZE',
          value: response.body
        });
      }.bind(this), function(error){
        throw new Error(error);
      });
  },

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
        )}
      />
    );
  }
});

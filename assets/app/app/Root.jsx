var React = require('react');
var browserHistory = require('react-router').browserHistory;
var superagent = require('superagent');
var _ = require('lodash/core');

var ControlBar = require('./ControlBar.jsx');

var Root = React.createClass({
  handleRootNavigation: function(event) {
    event.preventDefault();

    browserHistory.push('/v2');
  },

  handleRootRefresh: function(event) {
    event.preventDefault();

    document.body.classList.add('is-loading');
    superagent.get(`/topics`)
      .set('Accept', 'application/json')
        .then(function(response){
          window.store.dispatch({
            type: 'REINITIALIZE',
            value: response.body
          });
          document.body.classList.remove('is-loading');
        }.bind(this), function(error){
         throw new Error(error);
       });
  },

  render: function() {
    if (this.props.params.id) {
      var threadTitle = _.find(this.props.value.topics, {
        id: parseInt(this.props.params.id, 10)
      }).title;
    }

    return (
      <div className="app">
        <ControlBar
          title={threadTitle || this.props.value.appName}
          handleRootNavigation={this.handleRootNavigation}
          handleRootRefresh={this.handleRootRefresh}
        />
        {this.props.children}
      </div>
    );
  }
});

module.exports = Root;

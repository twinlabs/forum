var _ = require('lodash/core');
var ControlBar = require('./ControlBar.jsx');
var Topics = require('./Topics.jsx');
var ShowTopic = require('./ShowTopic.jsx');
var NewPost = require('./NewPost.jsx');
var Settings = require('./Settings.jsx');
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var IndexRoute = require('react-router').IndexRoute;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
var withRouter = require('react-router').withRouter;
var useBasename = require('history/lib/useBasename');
var superagent = require('superagent');

function withBasename(history, dirname) {
  return useBasename(function() {
    return history;
  })({ basename: '/v2' });
}

function createElement(originalProps) {
  return function(Component, props) {
    return <Component {...props} {...originalProps} />
  }
}

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

module.exports = React.createClass({
  render: function() {
    return (
      <div className="app">
        <Router
          history={withBasename(browserHistory, '/v2')}
          createElement={createElement(this.props)}
        >
          <Route path="/" component={Root}>
            <IndexRoute component={Topics} />
            <Route path="settings" component={Settings} />
            <Route path="topic/new" component={NewPost} />
            <Route path="topic/:id" component={ShowTopic} />
          </Route>
        </Router>
      </div>
    );
  }
});

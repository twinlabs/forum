var ControlBar = require('./app/ControlBar.jsx');
var Topics = require('./app/Topics.jsx');
var ShowTopic = require('./app/ShowTopic.jsx');
var NewTopic = require('./app/NewTopic.jsx');
var Settings = require('./app/Settings.jsx');
var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
var withRouter = require('react-router').withRouter;
var useBasename = require('history/lib/useBasename');

function withBasename(history, dirname) {
  return useBasename(function() {
    return history;
  })({ basename: '/react' });
}

function createElement(originalProps) {
  return function(Component, props) {
    return <Component {...props} {...originalProps} />
  }
}

module.exports = React.createClass({
  render: function() {
    return (
      <div className="app">
        <ControlBar
          appName={this.props.value.appName}
        />
        <Router
          history={withBasename(browserHistory, '/react')}
          createElement={createElement(this.props)}
        >
          <Route path="/" component={Topics} />
          <Route path="/settings" component={Settings} />
          <Route path="/topic/new" component={NewTopic} />
          <Route path="/topic/:id" component={ShowTopic} />
        </Router>
      </div>
    );
  }
});

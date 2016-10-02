var React = require('react');
var Router = require('react-router').Router;
var IndexRoute = require('react-router').IndexRoute;
var Route = require('react-router').Route;
var browserHistory = require('react-router').browserHistory;
var useBasename = require('history/lib/useBasename');

var Root = require('./Root.jsx');
var Topics = require('./Topics.jsx');
var ShowTopic = require('./ShowTopic.jsx');
var NewPost = require('./NewPost.jsx');
var Settings = require('./Settings.jsx');

function withBasename(history/*, dirname*/) {
  return useBasename(function() {
    return history;
  })({ basename: '/v2' });
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

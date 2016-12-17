var React = require('react');
var Router = require('react-router').Router;
var IndexRoute = require('react-router').IndexRoute;
var Route = require('react-router').Route;
var browserHistory = require('react-router').browserHistory;

var Root = require('./Root.jsx');
var Topics = require('./Topics.jsx');
var ShowTopic = require('./ShowTopic.jsx');
var ShowPost = require('./ShowPost.jsx');
var NewPost = require('./NewPost.jsx');
var Settings = require('./Settings.jsx');

function createElement(originalProps) {
  return function(Component, props) {
    return <Component {...props} {...originalProps} />
  }
}

module.exports = React.createClass({
  render: function() {
    return (
      <div className="routerContainer">
        <link rel="stylesheet" href={`/stylesheets/v2-${this.props.value.settings.style}.css`} />
        <Router
          history={browserHistory}
          createElement={createElement(this.props)}
        >
          <Route path="/" component={Root}>
            <IndexRoute component={Topics} />
            <Route path="settings" component={Settings} />
            <Route path="topic/new" component={NewPost} />
            <Route path="topic/:id" component={ShowTopic} />
            <Route path="post/:id" component={ShowPost} />
          </Route>
        </Router>
      </div>
    );
  }
});

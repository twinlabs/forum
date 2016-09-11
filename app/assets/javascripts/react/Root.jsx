var ControlBar = require('./app/ControlBar.jsx');
var Topics = require('./app/Topics.jsx');
var NewTopic = require('./app/NewTopic.jsx');
var Settings = require('./app/Settings.jsx');
var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="app">
        <ControlBar
          appName={this.props.value.appName}
        />
        <Topics
          topics={this.props.value.topics}
        />
        <Settings
          settings={this.props.value.settings}
          store={window.store}
        />
        <NewTopic
          store={window.store}
        />
      </div>
    )
  }
});

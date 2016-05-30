var ControlBar = require('./app/ControlBar.jsx');
var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  render: function() {
    return (
      <div className="app">
        <ControlBar
          appName={this.props.value.appName}
        />
      </div>
    )
  }
});

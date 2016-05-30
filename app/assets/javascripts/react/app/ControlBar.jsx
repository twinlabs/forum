var React = require('react');
var ReactDOM = require('react-dom');

var ControlBar = React.createClass({
  render: function() {
    return (
      <div className="controlBar">
        {this.props.appName},
        now in <kbd>React</kbd>.
      </div>
    )
  }
});

module.exports = ControlBar;

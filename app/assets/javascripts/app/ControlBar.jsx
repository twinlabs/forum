var React = require('react');
var ReactDOM = require('react-dom');

var ControlBar = React.createClass({
  render: function() {
    return (
      <div>
        Imagine...A Control Bar.
        {this.props.imagine}
        Whatever!
      </div>
    )
  }
});

module.exports = ControlBar;

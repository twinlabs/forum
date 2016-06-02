var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  render: function() {
    return (
      <div
        className="preify"
      >
        {this.props.children}
      </div>
    )
  }
});

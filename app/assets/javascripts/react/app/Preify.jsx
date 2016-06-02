var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  render: function() {
    return (
      <pre className="preify" style={{outline: '1px solid orange'}}>
        {this.props.children}
      </pre>
    )
  }
});

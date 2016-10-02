var React = require('react');

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

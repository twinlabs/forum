var React = require('react');
var classnames = require('classnames');

module.exports = React.createClass({
  render: function() {
    return (
      <input
        {...this.props}
        className={classnames('input', this.props.className)}
      />
    )
  }
});

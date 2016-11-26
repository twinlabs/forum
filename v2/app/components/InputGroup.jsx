var React = require('react');
var classnames = require('classnames');

module.exports = React.createClass({
  render: function() {
    return (
      <div
        {...this.props}
        className={classnames('inputGroup', this.props.className)}
      >
        {this.props.children}
      </div>
    );
  }
});

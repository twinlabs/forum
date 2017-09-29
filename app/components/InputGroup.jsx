var React = require('react');
var createReactClass = require('create-react-class');
var classnames = require('classnames');

module.exports = createReactClass({
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

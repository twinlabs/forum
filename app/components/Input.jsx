var React = require('react');
var createReactClass = require('create-react-class');
var classnames = require('classnames');

module.exports = createReactClass({
  render: function() {
    return (
      <input
        {...this.props}
        className={classnames('input', this.props.className)}
      />
    );
  },
});

var React = require('react');

var createReactClass = require('create-react-class');

module.exports = createReactClass({
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

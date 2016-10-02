var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  showEdit: function() {
    this.props.handleShowEdit();
  },

  render: function() {
    return (
      <button
        className="input"
        onClick={this.showEdit}
      >
        Edit
      </button>
    )
  }
})

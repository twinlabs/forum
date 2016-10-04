var React = require('react');

module.exports = React.createClass({
  showEdit: function() {
    this.props.handleShowEdit();
  },

  render: function() {
    return (
      <button
        className="input clickable"
        onClick={this.showEdit}
      >
        Edit
      </button>
    )
  }
})

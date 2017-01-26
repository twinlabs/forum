var React = require('react');
var InputGroup = require('./InputGroup.jsx');

var Filter = React.createClass({
  renderClearFilter: function() {
    if (!this.props.value) {
      return null;
    }

    if (!this.props.value.trim().length) {
      return null;
    }

    return (
      <button
        type="button"
        style={{
          'border': 'none',
          'backgroundColor':'transparent',
          'cursor': 'pointer'
        }}
        onClick={this.props.clearFilter}
      >
        &times;
      </button>
    );
  },

  render: function() {
    return (
      <InputGroup
        className="v-Atom filter"
      >
        <input
          type="text"
          placeholder={this.props.placeholder}
          ref="topicFilter"
          onChange={this.props.onChange}
          value={this.props.value}
          style={{
            'width': '100%',
            'border': 'none',
            'outline': 'none'
          }}
        />
        {this.renderClearFilter()}
        {this.props.children}
      </InputGroup>
    );
  }
});

module.exports = Filter;

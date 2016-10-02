var _ = require('lodash/core');
var React = require('react');
var Topic = require('./Topic.jsx');

var Topics = React.createClass({
  getInitialState: function() {
    return {
      filterValue: null
    };
  },

  updateFilterValue: function(event) {
    this.setState({
      filterValue: event.target.value
    });
  },

  render: function() {
    return (
      <div className="topicsContainer">
        <div className="topicsFilter">
          <input
            className="input"
            type="text"
            placeholder="Filter Topic Name"
            ref="topicFilter"
            onChange={this.updateFilterValue}
          />
        </div>
        {_.filter(this.props.value.topics, function(topic) {
          if (this.state.filterValue) {
            return !topic.parent && (topic.title.toLowerCase().indexOf(this.state.filterValue.toLowerCase()) !== -1);
          }
          return !topic.parent;
         }.bind(this)).map(Topic)}
      </div>
    );
  }
});


module.exports = Topics;


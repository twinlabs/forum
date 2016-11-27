var _ = require('lodash/core');
var React = require('react');
var Topic = require('./Topic.jsx');
var NewPost = require('./NewPost.jsx');
var InputGroup = require('./InputGroup.jsx');

var Topics = React.createClass({
  getInitialState: function() {
    return {
      filterValue: localStorage.getItem('forumFilterValue') || ''
    };
  },

  handleFilterChange: function(event) {
    this.updateFilterValue(event.target.value);
  },

  updateFilterValue: function(newFilterValue) {
    return this.setState({
      filterValue: newFilterValue
    }, function() {
      localStorage.setItem('forumFilterValue', newFilterValue);
    });
  },

  hasFilterValue: function() {
    return !!this.state.filterValue.trim().length;
  },

  hasUnreadFilter: function() {
    return this.state.filterValue.match('is:unread');
  },

  toggleUnread: function(event) {
    if (this.hasUnreadFilter()) {
      return this.updateFilterValue(this.state.filterValue.replace('is:unread', '').trim())
    }

    return this.updateFilterValue('is:unread ' + this.state.filterValue);
  },

  toggleClassNames: function() {
    if (this.hasUnreadFilter()) {
      return 'input--toggle isActive';
    }

    return 'input--toggle';
  },

  filterThreads: function() {
    return _.filter(this.props.value.topics, function(topic) {
      if (this.hasUnreadFilter()) {
        return unreadCriteria(topic) && filterCriteria(topic, this.state.filterValue.replace('is:unread', '').trim());
      }

      if (this.state.filterValue) {
        return filterCriteria(topic, this.state.filterValue.replace('is:unread', '').trim());
      }

      return !topic.parent;
    }.bind(this));
  },

  renderNewPost: function() {
    if (this.hasFilterValue()) {
      return null;
    }

    return (
      <NewPost
        location={this.props.location}
      />
    );
  },

  render: function() {
    return (
      <div className="topicsContainer">
        <InputGroup
          className="v-Atom filter"
        >
          <input
            type="text"
            placeholder="Filter Topic Name"
            ref="topicFilter"
            onChange={this.handleFilterChange}
            value={this.state.filterValue}
            style={{
              'width': '100%',
              'border': 'none',
              'outline': 'none'
            }}
          />
          <button
            className={this.toggleClassNames()}
            onClick={this.toggleUnread}
          >
            Only Unread
          </button>
        </InputGroup>
        {this.filterThreads().map(Topic)}
        {this.renderNewPost()}
      </div>
    );
  }
});


function unreadCriteria(topic) {
  return !topic.parent && topic.lastreply && topic.lastreply.isNew;
}

function filterCriteria(topic, filterValue) {
  return !topic.parent &&
    (topic.title.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1);
}

module.exports = Topics;


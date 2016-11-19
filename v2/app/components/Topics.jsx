var _ = require('lodash/core');
var React = require('react');
var Topic = require('./Topic.jsx');
var NewPost = require('./NewPost.jsx');

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

  render: function() {
    return (
      <div className="topicsContainer">
        <div className="topicsFilter input inputGroup">
          <input
            className="input--flush"
            type="text"
            placeholder="Filter Topic Name"
            ref="topicFilter"
            onChange={this.handleFilterChange}
            value={this.state.filterValue}
          />
          <button
            className={this.toggleClassNames()}
            onClick={this.toggleUnread}
          >
            Only Unread
          </button>
        </div>
        {this.filterThreads().map(Topic)}
        <NewPost
          location={this.props.location}
        />
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


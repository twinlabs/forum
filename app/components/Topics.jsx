var _ = require('lodash/core');
var React = require('react');
var createReactClass = require('create-react-class');
var browserHistory = require('react-router').browserHistory;
var Topic = require('./Topic.jsx');
var NewPost = require('./NewPost.jsx');
var Filter = require('./Filter.jsx');

var Topics = createReactClass({
  displayName: 'Topics',

  getInitialState: function() {
    return {
      filterValue: localStorage.getItem('forumFilterValue') || '',
    };
  },

  handleSearch: function(event) {
    event.preventDefault();

    if (!this.hasFilterValue()) {
      return false;
    }

    localStorage.setItem('forumFilterValue', '');
    document.body.classList.add('is-loading');

    browserHistory.push(`/search/${this.state.filterValue}`);
  },

  handleFilterChange: function(event) {
    this.updateFilterValue(event.target.value);
  },

  updateFilterValue: function(newFilterValue) {
    return this.setState(
      {
        filterValue: newFilterValue,
      },
      function() {
        localStorage.setItem('forumFilterValue', newFilterValue);
      },
    );
  },

  hasFilterValue: function() {
    return !!this.state.filterValue.trim().length;
  },

  hasUnreadFilter: function() {
    return this.state.filterValue.match('is:unread');
  },

  toggleUnread: function(event) {
    if (this.hasUnreadFilter()) {
      return this.updateFilterValue(
        this.state.filterValue.replace('is:unread', '').trim(),
      );
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
    return _.filter(
      this.props.value.topics,
      function(topic) {
        if (this.hasUnreadFilter()) {
          return (
            unreadCriteria(topic) &&
            filterCriteria(
              topic,
              this.state.filterValue.replace('is:unread', '').trim(),
            )
          );
        }

        if (this.state.filterValue) {
          return filterCriteria(
            topic,
            this.state.filterValue.replace('is:unread', '').trim(),
          );
        }

        return !topic.parent;
      }.bind(this),
    );
  },

  renderNewPost: function() {
    if (this.hasFilterValue()) {
      return null;
    }

    return <NewPost location={this.props.location} />;
  },

  render: function() {
    return (
      <div className="topicsContainer">
        <form onSubmit={this.handleSearch}>
          <Filter
            clearFilter={this.updateFilterValue.bind(this, '')}
            onChange={this.handleFilterChange}
            placeholder="Filter or Hit ↵ to Search"
            value={this.state.filterValue}
          >
            <button
              type="button"
              className={this.toggleClassNames()}
              onClick={this.toggleUnread}
            >
              Only Unread
            </button>
          </Filter>
        </form>
        {this.filterThreads().map(Topic)}
        {this.renderNewPost()}
      </div>
    );
  },
});

function unreadCriteria(topic) {
  return !topic.parent && topic.lastreply && topic.lastreply.isNew;
}

function filterCriteria(topic, filterValue) {
  return (
    !topic.parent &&
    (topic.title &&
      topic.title.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1)
  );
}

module.exports = Topics;

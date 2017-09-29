var _ = require('lodash/core');
var React = require('react');
var createReactClass = require('create-react-class');
var Thread = require('./Thread.jsx');
var Loader = require('./Loader.jsx');
var superagent = require('superagent');

module.exports = createReactClass({
  getInitialState: function() {
    return {
      offset: 0
    };
  },

  getExistingChildren: function() {
    return _.filter(this.props.value.topics, {
      parent: +this.props.routeParams.id
    });
  },

  getTopicPosts: function() {
    if (this.getExistingChildren().length < 20) {
      return _.filter(this.props.value.topics, {id: +this.props.routeParams.id}).concat(this.getExistingChildren());
    }

    return this.getExistingChildren();
  },

  componentWillMount: function() {
    // if the user has mounted before, they'll have
    // many existing children, so we shouldn't
    // do additional server work without their action:
    if (this.getExistingChildren().length >= 20) {
      return this.setState({
        offset: this.state.offset + this.getExistingChildren().length || 0
      });
    }
    // previous statement doesn't make concession for
    // tremendous socket activity in a short period of time,
    // but that's probably OK.

    this.setState({
      offset: this.state.offset + this.getExistingChildren().length || 0
    }, this.handleLoadMore);
  },

  handleLoadMore: function() {
    document.body.classList.add('is-loading');
    superagent.get(`/topic/${+this.props.routeParams.id}?limit=20&offset=${this.state.offset}`)
      .set('Accept', 'application/json')
      .then(function(response){
        window.store.dispatch({
          type: 'BACKFILL',
          value: response.body
        });

        this.setState({
          offset: this.state.offset + 20
        });

        document.body.classList.remove('is-loading');
      }.bind(this), function(error, a, b) {
        console.error(error);

        document.body.classList.remove('is-loading');
      });
  },

  renderLoadMore: function() {
    return (
      <div style={{margin: '0 0 3em'}}>
        <button className="input input--secondary clickable" onClick={this.handleLoadMore}>
          Load More
        </button>
      </div>
    );
  },

  render: function() {
    var topicData = _.find(this.props.value.topics, {
      id: +this.props.routeParams.id
    });

    return (
      <div>
        <Thread
          {...topicData}
          loadMore={this.loadMore}
          renderLoadMore={this.renderLoadMore}
          posts={this.getTopicPosts()}
          settings={this.props.value.settings}
        />
        <Loader />
      </div>
    );
  }
});

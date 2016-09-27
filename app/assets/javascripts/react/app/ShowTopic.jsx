var _ = require('lodash/core');
var React = require('react');
var ReactDOM = require('react-dom');
var Thread = require('./Thread.jsx');
var Loader = require('./Loader.jsx');
var superagent = require('superagent');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      offset: 20
    };
  },

  componentWillMount: function() {
    const topicID = parseInt(this.props.routeParams.id, 10);
    const receivedTopicChildren = _.some(window.store.getState().topics, {
      parent: topicID
    });

    if (receivedTopicChildren) {
      return false
    }

    superagent.get(`/topic/${topicID}`)
      .set('Accept', 'application/json')
      .then(function(response){
        window.store.dispatch({
          type: 'INITIALIZE',
          value: response.body
        });
      }.bind(this), function(error){
        throw new Error(error);
      });
  },

  handleLoadMore: function() {
    document.body.classList.add('is-loading');
    superagent.get(`/topic/${parseInt(this.props.routeParams.id, 10)}?limit=20&offset=${this.state.offset}`)
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
      }.bind(this), function(error) {
        throw new Error(error);
      });
  },

  renderLoadMore: function() {
    return (
      <div style={{margin: '0 0 3em'}}>
        <button className="input input--secondary" onClick={this.handleLoadMore}>
          Load More
        </button>
      </div>
    );
  },

  render: function() {
    var topicData = _.find(this.props.value.topics, {
      id: parseInt(this.props.routeParams.id, 10)
    });

    return (
      <div>
        <Thread
          {...topicData}
          loadMore={this.loadMore}
          renderLoadMore={this.renderLoadMore}
          posts={_.filter(this.props.value.topics,
            {
              parent: parseInt(this.props.routeParams.id, 10)
            }
          )}
        />
        <Loader />
      </div>
    );
  }
});

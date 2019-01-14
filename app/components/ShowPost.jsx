var React = require('react');
var createReactClass = require('create-react-class');
var ThreadPost = require('./ThreadPost.jsx');
var Link = require('react-router').Link;
var superagent = require('superagent');
var _ = require('lodash/core');

module.exports = createReactClass({
  componentWillMount: function() {
    // if we don't have an ID, we don't have anything
    // to find or fetch - we're populating the ThreadPost
    // from passed-in props.
    if (!this.props.routeParams.id) {
      return false;
    }

    var thread = _.find(this.props.value.topics, {
      id: +this.props.params.id,
    });

    if (thread) {
      return this.setState({
        postData: thread,
      });
    }

    superagent
      .get(`/topic/${+this.props.routeParams.id}`)
      .set('Accept', 'application/json')
      .then(
        function(response) {
          this.setState({
            postData: response.body[0],
          });
        }.bind(this),
        function(error, a, b) {
          console.error(error);
        },
      );
  },

  getThread: function() {
    if (!this.state) {
      return false;
    }

    var parent = _.find(this.props.value.topics, {
      id: this.state.postData.parent,
    });

    return (
      <div
        style={{
          display: 'flex',
        }}
      >
        <Link
          to={`/topic/${parent.id}`}
          className="controlBar-control"
          style={{
            margin: '1em auto',
          }}
        >
          From Thread: {parent.title}
        </Link>
      </div>
    );
  },

  getData: function() {
    if (this.state) {
      return this.state && this.state.postData;
    }

    if (this.props) {
      return this.props;
    }
  },

  render: function() {
    return (
      <div className="thread">
        {this.getThread()}

        <ThreadPost
          contentRenderer={require('./markdownInitializer')}
          {...this.getData()}
          {...this.props.value}
        />
      </div>
    );
  },
});

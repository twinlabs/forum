var React = require('react');
var ThreadPost = require('./ThreadPost.jsx');
var Loader = require('./Loader.jsx');
var Link = require('react-router').Link;
var superagent = require('superagent');
var _ = require('lodash/core');

module.exports = React.createClass({
  componentWillMount: function() {
    var thread = _.find(this.props.value.topics, {
      id: +this.props.params.id
    });

    if (thread) {
      return this.setState({
        postData: thread
      });
    }

    superagent.get(`/topic/${parseInt(this.props.routeParams.id, 10)}`)
      .set('Accept', 'application/json')
      .then(function(response){
        this.setState({
          postData: response.body[0]
        });
      }.bind(this), function(error, a, b) {
        console.error(error);
      });
  },

  getThread: function() {
    if (!this.state) {
      return false;
    }

    var parent = _.find(this.props.value.topics, {
      id: this.state.postData.parent
    });

    return (
      <div
        style={{
          'display': 'flex'
        }}
      >
        <Link
          to={`/topic/${parent.id}`}
          className="controlBar-control"
          style={{
            'margin': '1em auto',
          }}
        >
          From Thread: {parent.title}
        </Link>
      </div>
    );
  },

  render: function() {
    return (
      <div
        className="thread"
      >
        {this.getThread()}

        <ThreadPost
          contentRenderer={require('./markdownInitializer')}
          {...this.state && this.state.postData}
        />
        <Loader />
      </div>

    )
  }
});

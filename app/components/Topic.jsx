var React = require('react');
var createReactClass = require('create-react-class');
var moment = require('moment');
var Link = require('react-router').Link;

var Topic = createReactClass({
  displayName: 'Topic',

  getInitialState: function() {
    return {
      isEditing: false,
    };
  },

  getDefaultProps: function() {
    return {
      replycount: 0,
      lastreply: {
        created_at: {},
        user: {},
      },
    };
  },

  componentDidMount: function() {
    this.mountTicker(this.props.lastreply.created_at);
  },

  componentWillUnmount: function() {
    clearInterval(this.tickerID);
  },

  mountTicker: function(timestamp) {
    this.setState({
      activeTime: moment(timestamp).fromNow(),
    });

    this.tickerID = setInterval(
      function() {
        this.setState({
          activeTime: moment(timestamp).fromNow(),
        });
      }.bind(this),
      1000,
    );
  },

  handleDelete: function() {
    window.socket.emit('destroy', {
      id: this.props.id,
      user: {
        id: window.forum.constants.user.id,
        name: window.forum.constants.user.name,
      },
    });
  },

  isNew: function() {
    return this.props.lastreply && this.props.lastreply.isNew;
  },

  markRead: function() {
    window.store.dispatch({
      type: 'MARKREAD',
      value: this.props,
    });
  },

  render: function() {
    return (
      <Link
        to={`/topic/${this.props.id}`}
        className={`post ${this.isNew() ? 'isNew' : null} v-Atom atom`}
        onClick={this.markRead}
        data-id={this.props.id}
      >
        <div className="topic-title">{this.props.title}</div>
        <div className="data">
          {this.props.replycount} Replies, last by{' '}
          <span className="data-callout">{this.props.lastreply.user.name}</span>
          {` ${this.state.activeTime}.`}
        </div>
      </Link>
    );
  },
});

module.exports = function(topicData, index) {
  return <Topic key={topicData.id} {...topicData} />;
};

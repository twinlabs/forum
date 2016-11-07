var React = require('react');
var TopicControls = require('./PostControls.jsx');
var moment = require('moment');
var Link = require('react-router').Link;

var Topic = React.createClass({
  getInitialState: function() {
    return {
      isEditing: false
    };
  },

  getDefaultProps: function() {
    return {
      replycount: 0,
      lastreply: {
        created_at: {},
        user: {}
      }
    }
  },

  componentDidMount: function() {
    this.mountTicker(this.props.lastreply.created_at);
  },

  mountTicker: function(timestamp) {
    this.setState({
      activeTime: moment(timestamp).fromNow()
    });

    setInterval(function(){
      this.setState({
        activeTime: moment(timestamp).fromNow()
      });
    }.bind(this), 1000);
  },

  handleDelete: function() {
    window.socket.emit('destroy', {
      id: this.props.id,
      user: {
        id: window.forum.constants.user.id,
        name: window.forum.constants.user.name
      }
    });
  },

  handleShowEdit: function() {
    this.setState({
      isEditing: true
    });
  },

  handleFinishEdit: function() {
    this.setState({
      isEditing: false
    });
  },

  showControls: function() {
    if (this.state.isEditing) {
      return (
        <div className="inputGroupContainer">
          <div className="inputGroup">
            <button
              className="input"
              onClick={this.handleDelete}
            >
              Delete
            </button>
          </div>
          <button
            className="input"
            onClick={this.handleFinishEdit}
          >
            Done
          </button>
        </div>
      );

    }

    return (
      <TopicControls
        post={this.props}
        handleShowEdit={this.handleShowEdit}
      />
    );
  },

  isNew: function() {
    return this.props.lastreply &&
      this.props.lastreply.isNew;
  },

  markRead: function() {
    window.store.dispatch({
      type: 'MARKREAD',
      value: this.props
    });
  },

  render: function() {
    return (
      <Link
        to={`/topic/${this.props.id}`}
        className={`post ${this.isNew() ? 'isNew':null} atom`}
        onClick={this.markRead}
        data-id={this.props.id}
      >
        <div className="" style={{fontSize: "20px"}}>{this.props.title}</div>
        <div
          className="data"
        >
          {this.props.replycount} Replies,
          last by <span className="data-callout">
            {this.props.lastreply.user.name}
          </span>
          {` ${this.state.activeTime}.`}
        </div>
      </Link>
    )
  }
});

module.exports = function(topicData, index) {
  return (
    <Topic
      key={index}
      {...topicData}
    />
  );
}

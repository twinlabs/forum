var React = require('react');
var ReactDOM = require('react-dom');
var Input = require('./Input.jsx');
var browserHistory = require('react-router').browserHistory;

var NewPost = React.createClass({
  getInitialState: function() {
    return {
      inline: true,
      body: ''
    };
  },

  animateSubmission: function() {
    this.setState({
      animatedHeight: '0'
    });

    setTimeout(function() {
      this.setState({
        animatedHeight: null,
        body: '',
        restrictSubmit: false
      });
    }.bind(this), 200);
  },

  constructQuote: function(data) {
    if (this.state.body === data.body) {
      return false;
    }

    this.setState({
      body: this.bodyMassage(data.body, data.author),
    }, this.handleFocus);

  },

  bodyMassage: function(body, author) {
     return `
      > ${author} wrote:

      ${body.replace(/^/, "> ")
        .replace(/\n/g, "\n> ")}
     `
      .replace(/^\s+/g,'')
      .replace(/\n +/,'\n').trim() + '\n\n';
  },

  handleFocus: function() {
    ReactDOM.findDOMNode(this.refs.body).scrollIntoView();
    ReactDOM.findDOMNode(this.refs.body).focus();
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var postBody = ReactDOM.findDOMNode(this.refs.body).value.trim();

    if (!postBody) {
      return false;
    }

    this.setState({
      restrictSubmit: true
    });

    window.socket.emit('post', {
      parent: this.props.parent,
      title: this.refs.title && this.refs.title.value,
      body: postBody,
      user: {
        id: window.forum.constants.user.id,
        name: window.forum.constants.user.name
      }
    }, function() {
      this.animateSubmission();

      if (this.props.route && this.props.route.path === 'topic/new') {
        setTimeout(function() {
          browserHistory.push('/v2');
        }, 1);
      }
    }.bind(this))
  },

  renderTitle: function() {
    if (this.props.parent) {
      return null;
    }

    return (
      <Input
        className="v-Atom"
        type="text"
        placeholder="Title"
        ref="title"
        disabled={this.state && this.state.restrictSubmit}
      />
    );
  },

  handleChange: function(event) {
    this.setState({
      body: event.target.value
    });
  },

  renderBody: function() {
    if (!this.props.inline || !this.state.inline) {
      return (
        <textarea
          className="input focusArea v-Atom"
          style={{
            height: this.state && this.state.animatedHeight,
            minHeight: (this.state && this.state.animatedHeight) ? '0' : null,
            padding: (this.state && this.state.animatedHeight) ? '4px' : null
          }}
          type="text"
          placeholder="Body"
          ref="body"
          onFocus={this.handleFocus}
          disabled={this.state && this.state.restrictSubmit}
          onChange={this.handleChange}
          value={this.state.body}
        />
      )
    }

    return (
      <div
        style={{display: 'flex'}}
      >
        <Input
          className="v-Atom"
          type="text"
          placeholder="Body"
          ref="body"
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          value={this.state.body}
          disabled={this.state && this.state.restrictSubmit}
        />
        <button
          ref="button"
          className="action action--alwaysOn inlineAction"
          type="button"
          onClick={function() {
            this.setState({
              inline: false
            });
          }.bind(this)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            whiteSpace: 'nowrap',
            margin: 0
          }}
        >
          ...
        </button>
      </div>
    );
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.receivedQuote && nextProps.receivedQuote !== this.props.receivedQuote) {
      this.constructQuote(nextProps.receivedQuote);
    }
  },

  getSubmitText: function() {
    if (!this.props.location) {
      // thread
      return 'Submit';
    }

    // post
    return 'Submit';
  },

  renderSubmitContext: function() {
    if (!this.props.inline || !this.state.inline) {
      return (
        <button
          ref="button"
          className="focusAction action action--alwaysOn"
          type="submit"
        >
          {this.getSubmitText()}
        </button>
      );
    }
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderTitle()}
        {this.renderBody()}
        {this.renderSubmitContext()}
      </form>
    )
  }
});

module.exports = React.createClass({
  forceLongform: function() {
    if (this.props.receivedQuote) {
      return true;
    }

    if (this.props.location && this.props.location.pathname === '/topic/new') {
      return true;
    }

    if (this.props.location && this.props.location.pathname === '/') {
      return true;
    }
  },

  render: function() {
    return (
      <NewPost
        receivedQuote={this.props.receivedQuote}
        inline={!this.forceLongform()}
        store={window.store}
        parent={this.props.parent}
        route={this.props.route}
        location={this.props.location}
      />
    );
  }
});

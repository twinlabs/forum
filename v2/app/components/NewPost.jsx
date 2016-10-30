var React = require('react');
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
      if (this.refs.body) {
        this.refs.body.value = '';
      }

      this.setState({
        animatedHeight: null
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
    this.refs.body.scrollIntoView();
    this.refs.body.focus();
  },

  handleSubmit: function(event) {
    event.preventDefault();

    if (!this.refs.body || !this.refs.body.value.trim()) {
      return false;
    }

    this.setState({
      restrictSubmit: true
    });

    window.socket.emit('post', {
      parent: this.props.parent,
      title: this.refs.title && this.refs.title.value,
      body: this.refs.body && this.refs.body.value,
      user: {
        id: window.forum.constants.user.id,
        name: window.forum.constants.user.name
      }
    }, function() {
      this.setState({
        restrictSubmit: false,
        body: ''
      });

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
      <input
        className="input"
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
          className="input focusArea"
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
        ></textarea>
      )
    }

    return (
      <div
        style={{display: 'flex'}}
      >
        <input
          className="input"
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
    if (nextProps.receivedQuote) {
      this.constructQuote(nextProps.receivedQuote);
    }
  },

  renderSubmitContext: function() {
    if (!this.props.inline || !this.state.inline) {
      return (
        <button
          ref="button"
          className="focusAction action action--alwaysOn"
          type="submit"
        >
          Submit Post
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
  },

  render: function() {
    return (
      <NewPost
        receivedQuote={this.props.receivedQuote}
        inline={!this.forceLongform()}
        store={window.store}
        parent={this.props.parent}
        route={this.props.route}
      />
    );
  }
});

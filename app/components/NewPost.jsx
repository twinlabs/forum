var React = require('react');
var createReactClass = require('create-react-class');
var ReactDOM = require('react-dom');
var Input = require('./Input.jsx');
var Progress = require('./Progress.jsx');
var browserHistory = require('react-router').browserHistory;
var superagent = require('superagent');
var getMarkdownFileType = require('../../lib/helpers').getMarkdownFileType;

var NewPost = createReactClass({
  displayName: 'NewPost',

  getInitialState: function() {
    return {
      inline: true,
      body: '',
    };
  },

  animateSubmission: function() {
    this.setState({
      animatedHeight: '0',
    });

    setTimeout(
      function() {
        this.setState({
          animatedHeight: null,
          body: '',
          restrictSubmit: false,
        });
      }.bind(this),
      200,
    );
  },

  constructQuote: function(data) {
    if (data.author) {
      return this.constructQuoteInline(data);
    }

    return this.constructQuoteReference(data);
  },

  constructQuoteInline: function(data) {
    if (this.state.body === data.body) {
      return false;
    }

    var updatedBody = `${this.bodyMassage(data.body, data.author)}`;

    if (this.state.body.trim().length) {
      updatedBody = `${this.state.body.trim()}\n\n${this.bodyMassage(
        data.body,
        data.author,
      )}`;
    }

    this.setState(
      {
        body: updatedBody,
      },
      this.handleFocus,
    );
  },

  constructQuoteReference: function(postId) {
    var updatedBody = `https://${window.location.host}/post/${postId}\n\n`;

    if (this.state.body.trim().length) {
      updatedBody = `${this.state.body.trim()}\n\nhttps://${
        window.location.host
      }/post/${postId}\n\n`;
    }

    this.setState(
      {
        body: updatedBody,
      },
      this.handleFocus,
    );
  },

  hasTitle: function() {
    return ReactDOM.findDOMNode(this.refs.title);
  },

  getTitle: function() {
    var titleNode = this.hasTitle();

    if (titleNode) {
      return titleNode.value.trim();
    }
  },

  bodyMassage: function(body, author) {
    return (
      `
      > ${author} wrote:

      ${body.replace(/^/, '> ').replace(/\n/g, '\n> ')}
     `
        .replace(/^\s+/g, '')
        .replace(/\n +/, '\n')
        .trim() + '\n\n'
    );
  },

  handleFile: function(event) {
    var formData = new FormData();

    for (var fileKey in event.target.files) {
      if (
        event.target.files.hasOwnProperty(fileKey) &&
        event.target.files[fileKey] instanceof File
      ) {
        formData.append('files[]', event.target.files[fileKey]);
      }
    }

    superagent
      .post('/upload')
      .send(formData)
      .on(
        'progress',
        function(event) {
          this.setState({
            progress: event.percent,
          });
        }.bind(this),
      )
      .end(
        function(error, response) {
          var updatedBody = getMarkdownFileType(response.body.url);

          if (this.state.body.trim().length) {
            updatedBody = `${this.state.body}\n\n${updatedBody}`;
          }

          this.setState({
            inline: false,
            body: updatedBody,
            progress: null,
          });
        }.bind(this),
      );
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

    if (this.hasTitle() && !this.getTitle()) {
      return false;
    }

    this.setState({
      restrictSubmit: true,
    });

    window.socket.emit(
      'post',
      {
        parent: this.props.parent,
        title: this.getTitle(),
        body: postBody,
        user: {
          id: window.forum.constants.user.id,
          name: window.forum.constants.user.name,
        },
      },
      function() {
        this.animateSubmission();

        if (this.props.route && this.props.route.path === 'topic/new') {
          setTimeout(function() {
            browserHistory.push('/');
          }, 1);
        }
      }.bind(this),
    );
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
      body: event.target.value,
    });
  },

  renderBody: function() {
    if (!this.props.inline || !this.state.inline) {
      return (
        <div>
          <Progress progress={this.state.progress} />
          <div>
            <textarea
              className="input focusArea v-Atom"
              style={{
                height: this.state && this.state.animatedHeight,
                minHeight: this.state && this.state.animatedHeight ? '0' : null,
                padding: this.state && this.state.animatedHeight ? '4px' : null,
              }}
              type="text"
              placeholder="Body"
              ref="body"
              onFocus={this.handleFocus}
              disabled={this.state && this.state.restrictSubmit}
              onChange={this.handleChange}
              value={this.state.body}
            />
            {this.renderAttachInput()}
          </div>
        </div>
      );
    }

    return (
      <div>
        <Progress progress={this.state.progress} />
        <div style={{ display: 'flex' }}>
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
                inline: false,
              });
            }.bind(this)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              whiteSpace: 'nowrap',
              margin: 0,
            }}
          >
            ...
          </button>
          {this.renderAttachInput()}
        </div>
      </div>
    );
  },

  componentWillReceiveProps: function(nextProps) {
    if (
      nextProps.receivedQuote &&
      nextProps.receivedQuote !== this.props.receivedQuote
    ) {
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

  renderAttachInput() {
    return (
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <img
          src="/paperclip.svg"
          style={{
            width: '20px',
            height: '20px',
          }}
          className="paperclip"
        />
        <input
          type="file"
          style={{
            width: '0.1px',
            height: '0.1px',
            opacity: 0,
            overflow: 'hidden',
            position: 'absolute',
            zIndex: '-1',
          }}
          tabIndex={-1}
          onChange={this.handleFile}
        />
      </label>
    );
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderTitle()}
        {this.renderBody()}
        {this.renderSubmitContext()}
      </form>
    );
  },
});

module.exports = createReactClass({
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
  },
});

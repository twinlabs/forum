var React = require('react');
var createReactClass = require('create-react-class');
var Link = require('react-router').Link;
var classNames = require('classnames');
var iframeResizer = require('iframe-resizer').iframeResizer;
var ThreadPostTime = require('./ThreadPostTime.jsx');
var oembed = require('./oembed');

module.exports = createReactClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    if (
      this.state.transformedContent
      && !this.state.needsFlush
      && this.state.isEditing === nextState.isEditing
      && this.state.showDelete === nextState.showDelete
      && (nextProps.body === this.props.body)
    ) {
      return false;
    }

    return true;
  },

  getDefaultProps: function() {
    return {
      contentRenderer: function(input){
        return input
      },
      forumUser: {
        id: 0,
        name: '[User Name]'
      },
      // obviously we shouldn't have both.
      // this is debt that must be reconciled:
      user: {}
    };
  },

  getInitialState: function() {
    return {
      isEditing: false,
      showDelete: false
    };
  },

  inlineQuote: function(event) {
    event.preventDefault();

    if (this.props.isSearchResult) {
      var setInlinePost = function(author, body) {
         return `
          > ${author} wrote:

          ${body.replace(/^/, "> ")
            .replace(/\n/g, "\n> ")}
         `
          .replace(/^\s+/g,'')
          .replace(/\n +/,'\n').trim() + '\n\n';
      }
      var inlinePost = setInlinePost(this.props.user.name, this.props.body);
      document.addEventListener('copy', function (event) {
        event.clipboardData.setData('text/plain', inlinePost);
        event.preventDefault();
      })
      document.execCommand('copy', inlinePost);
      return alert('Copied inline post to clipboard');
    }

    return this.props.handleQuote({
      author: this.props.user.name,
      body: this.props.body
    });
  },

  referenceQuote: function(event) {
    event.preventDefault();

    if (this.props.isSearchResult) {
      var postUrl = `https://${window.location.host}/post/${this.props.id}`;
      document.addEventListener('copy', function (event) {
        event.clipboardData.setData('text/plain', postUrl);
        event.preventDefault();
      })
      document.execCommand('copy', postUrl);
      return alert('Copied post URL to clipboard');
    }

    return this.props.handleQuote(this.props.id);
  },

  renderDelete: function() {
    if (this.props.user_id !== this.props.forumUser.id) {
      return null;
    }

    return (
      <a
        href="#"
        className="action"
        onClick={this.setState.bind(this, {showDelete: true}, null)}
      >
        Delete
      </a>
    );
  },

  renderDeleteConfirm: function() {
    if (!this.state.showDelete) {
      return null;
    }

    return (
      <div
        className="v-Overlay"
      >
        <h2>
          Really Delete?
        </h2>

        <div>
          <button
            className="action"
            onClick={this.handleDelete}
          >
            Yes
          </button>
          <button
            className="action"
            onClick={this.setState.bind(this, {showDelete: false}, null)}
          >
            No
          </button>
        </div>
      </div>
    )
  },

  renderEdit: function() {
    if (this.props.user_id !== this.props.forumUser.id) {
      return null;
    }

    if (this.state.isEditing) {
      return (
        <div style={{display: 'inline-block'}}>
          <a
            href="#"
            className="action"
            onClick={this.cancelEdit}
          >
            Cancel
          </a>
          <a
            href="#"
            className="action"
            onClick={this.handleSave}
          >
            Save
          </a>
        </div>
      );
    }

    return (
      <a
        href="#"
        className="action"
        onClick={this.showEdit}
      >
        Edit
      </a>
    );
  },

  renderThread: function() {
    if (this.props.isSearchResult) {
      if (this.props.parent) {
        return (
          <Link
            className="action"
            to={`/topic/${this.props.parent}`}
          >
            Thread
          </Link>
        );
      }
      return (
        <Link
          className="action"
          to={`/topic/${this.props.id}`}
        >
          Thread
        </Link>
      );
    }

    return null;
  },

  handleDelete: function() {
    this.setState({
      showDelete: false
    });

    window.socket.emit('destroy', {
      id: this.props.id,
      user: {
        id: this.props.forumUser.id,
        name: this.props.forumUser.name
      }
    });
  },

  handleSave: function() {
    window.socket.emit('edit', {
      body: this.refs.body.value,
      id: this.props.id,
      parent: this.props.parent,
      user: {
        id: this.props.forumUser.id,
        name: this.props.forumUser.name
      }
    });

    this.setState({
      isEditing: false,
      needsFlush: true
    });
  },

  cancelEdit: function(event) {
    event.preventDefault();

    this.setState({
      isEditing: false
    });
  },

  showEdit: function(event) {
    event.preventDefault();

    this.setState({
      isEditing: true
    });
  },

  renderContent: function() {
    if (this.state.isEditing) {
      return (
        <div>
          <textarea
            className="input focusArea preify"
            defaultValue={this.props.body}
            ref="body"
          />
          {this.renderDeleteConfirm()}
        </div>
      );
    }

    return (
      <div className="contentFrame">
        <div
          className="body content"
          ref="content"
          dangerouslySetInnerHTML={this.renderAsHTML(this.state.transformedContent || this.props.body, this.props.contentRenderer)}
        />
        {this.renderSignature()}
        {this.renderDeleteConfirm()}
      </div>
    );
  },

  renderSignature: function() {
    if (this.props.depth) {
      return null;
    }

    if (!this.props.user.signature) {
      return null;
    }

    if (window.forum.constants.user.hide_signatures) {
      return null;
    }

    return (
      <div
        className="signature"
        dangerouslySetInnerHTML={this.renderAsHTML(this.props.user.signature)}
      />
    );
  },

  componentDidMount: function() {
    return this.transformContent(this.props.body);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.body !== this.props.body) {
      return this.transformContent(nextProps.body);
    }

    return this.transformContent(this.state.transformedContent);
  },

  transformContent: function(transformableContent) {
    if (this.props.settings && this.props.settings.disableEmbeds === 'true') {
      return this.setState({
        transformedContent: transformableContent,
        needsFlush: false
      });
    }

    oembed(transformableContent, parseInt(this.props.depth) + 1).then(function(transformedContent) {
      this.setState({
        transformedContent: transformedContent,
        needsFlush: false
      });

      window.twttr && window.twttr.widgets.load();
      window.instgrm && window.instgrm.Embeds.process();
      iframeResizer();
    }.bind(this));
  },

  renderAsHTML: function(input, renderer) {
    input = input || '';
    renderer = renderer || function(input) { return input };

    return {
      __html: renderer(input)
    };
  },

  renderActions: function() {
    if (this.props.depth) {
      return (
        null
      );
    }

    return (
      <div
        className="actionContainer"
        onClick={function(event){
          event.preventDefault();
        }}
      >
        <a
          href={`/post/${this.props.id}`}
          className="action"
          onClick={this.referenceQuote}
        >
          Quote
        </a>

        <a
          href="#"
          className="action"
          onClick={this.inlineQuote}
        >
          Inline
        </a>

        <Link
          className="action"
          to={`/post/${this.props.id}`}
        >
          Link
        </Link>

        {this.renderThread()}
        {this.renderEdit()}
        {this.renderDelete()}
      </div>
    );
  },

  render: function() {
    return (
      <div
        className={classNames("post v-Atom", this.props.className)}
        data-id={this.props.id}
        data-user-id={this.props.user.id}
        key={this.props.id}
      >
        <div
          className="data"
        >
          <span className="data-callout">
            {this.props.user && this.props.user.name}
          </span>
          <ThreadPostTime
            timestamp={this.props.updated_at}
          />
        </div>
        {this.renderContent()}
        {this.renderActions()}
      </div>
    )
  }
});

var React = require('react');
var Link = require('react-router').Link;
var ThreadPostTime = require('./ThreadPostTime.jsx');
var oembed = require('./oembed');

module.exports = React.createClass({
  shouldComponentUpdate: function(nextProps, nextState) {
    if (
      this.state.transformedContent
      && !this.state.needsFlush
      && this.state.isEditing === nextState.isEditing
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
      isEditing: false
    };
  },

  sendQuote: function(event) {
    event.preventDefault();

    return this.props.handleQuote({
      author: this.props.user.name,
      body: this.props.body
    });
  },

  renderDelete: function() {
    if (this.props.user_id !== this.props.forumUser.id) {
      return null;
    }

    return (
      <a
        href="#"
        className="action"
        onClick={this.handleDelete}
      >
        Delete
      </a>
    );
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

  handleDelete: function() {
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
        <textarea
          className="input focusArea preify"
          defaultValue={this.props.body}
          ref="body"
        />
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
      </div>
    );
  },

  renderSignature: function() {
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
    oembed(transformableContent).then(function(transformedContent) {
      this.setState({
        transformedContent: transformedContent,
        needsFlush: false
      });

      window.twttr && window.twttr.widgets.load();
      window.instgrm && window.instgrm.Embeds.process();
    }.bind(this));
  },

  renderAsHTML: function(input, renderer) {
    input = input || '';

    // tweets are complex.
    // don't try to pass them through markdown renderer:
    if (input.match('class="twitter-tweet"')) {
      return {
        __html: input
      };
    }

    renderer = renderer || function(input) { return input };

    return {
      __html: renderer(input)
    };
  },

  render: function() {
    return (
      <div
        className="post v-Atom"
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
        <div
          className="actionContainer"
          onClick={function(event){
            event.preventDefault();
          }}
        >
          <a
            href="#"
            className="action"
            onClick={this.sendQuote}
          >
            Quote
          </a>

          <Link
            className="action"
            to={`/post/${this.props.id}`}
          >
            Link
          </Link>
          {this.renderEdit()}
          {this.renderDelete()}
        </div>
      </div>
    )
  }
});

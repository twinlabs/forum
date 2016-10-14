var React = require('react');
var moment = require('moment');
var oembed = require('./oembed');

module.exports = React.createClass({
  getDefaultProps: function() {
    return {
      contentRenderer: function(input){
        return input
      },
      forumUser: {
        id: 0,
        name: 'User Name'
      }
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
      isEditing: false
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
      <div
        className="body content"
        ref="content"
        dangerouslySetInnerHTML={this.renderAsHTML(this.state.transformedContent)}
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
    oembed(transformableContent, function(transformedContent) {
      this.setState({
        transformedContent: transformedContent
      });

      window.twttr && window.twttr.widgets.load();
      window.instgrm && window.instgrm.Embeds.process();
    }.bind(this));
  },

  renderAsHTML: function(input) {
    input = input || '';

    return {
      __html: this.props.contentRenderer(input)
    };
  },

  render: function() {
    return (
      <div
        className="post"
        data-id={this.props.id}
        key={this.props.id}
      >
        <div
          className="data"
        >
          <span className="data-callout">
            {this.props.user && this.props.user.name}
          </span> {moment(this.props.updated_at).fromNow()}.
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
          {this.renderEdit()}
          {this.renderDelete()}
        </div>
      </div>
    )
  }
});

var React = require('react');
var moment = require('moment');
var oembed = require('./oembed');

module.exports = React.createClass({
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
    if (this.props.user_id !== window.forum.constants.user.id) {
      return null;
    }

    return (
      <div
        className="action"
        onClick={this.handleDelete}
      >
        Delete
      </div>
    );
  },

  renderEdit: function() {
    if (this.props.user_id !== window.forum.constants.user.id) {
      return null;
    }

    if (this.state.isEditing) {
      return (
        <div
          className="action"
          onClick={this.handleSave}
        >
          Save
        </div>
      );
    }

    return (
      <div
        className="action"
        onClick={this.showEdit}
      >
        Edit
      </div>
    );
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

  handleSave: function() {
    window.socket.emit('edit', {
      body: this.refs.body.value,
      id: this.props.id,
      parent: this.props.parent,
      user: {
        id: window.forum.constants.user.id,
        name: window.forum.constants.user.name
      }
    });

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

      window.twttr.widgets.load();
      window.instgrm.Embeds.process();
    }.bind(this));
  },

  renderAsHTML: function(input) {
    input = input || '';

    return {
      __html: this.props.marked(input)
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
          <div
            className="action"
            onClick={this.sendQuote}
          >
            Quote
          </div>
          {this.renderEdit()}
          {this.renderDelete()}
        </div>
      </div>
    )
  }
});

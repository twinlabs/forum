var React = require('react');
var moment = require('moment');
var oembed = require('./oembed');

module.exports = React.createClass({
  getInitialState: function() {
    return {};
  },

  sendQuote: function(event) {
    event.preventDefault();

    return this.props.handleQuote({
      author: this.props.user.name,
      body: this.props.body
    });
  },

  componentDidMount: function() {
    return this.transformContent(this.props.body);
  },

  componentWillReceiveProps: function() {
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
        <div
          className="body content"
          ref="content"
          dangerouslySetInnerHTML={this.renderAsHTML(this.state.transformedContent)}
        />
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
        </div>
      </div>
    )
  }
});

var React = require('react');
var ReactDOM = require('react-dom');

module.exports = React.createClass({
  sendQuote: function(event) {
    event.preventDefault();

    return this.props.handleQuote({
      author: this.props.user.name,
      body: this.props.body
    });
  },

  renderAsHTML: function(input) {
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
          dangerouslySetInnerHTML={this.renderAsHTML(this.props.body)}
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

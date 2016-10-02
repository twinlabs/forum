var React = require('react');
var ReactDOM = require('react-dom');
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

  // we can try the same routine as before.
  // this time, use the flag
  // to control shouldComponentUpdate.
  shouldComponentUpdate: function() {
    return !this.state.flushableHTML;
  },

  renderAsHTML: function(input) {
    var maybe = oembed(input)

    if (maybe.then) maybe.then(function(data){
      this.setState({
        flushableHTML: data.html
      });
    }.bind(this));

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

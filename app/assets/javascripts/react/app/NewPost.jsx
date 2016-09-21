var React = require('react');
var ReactDOM = require('react-dom');
var request = require('superagent');

var NewTopic = React.createClass({
  animateSubmission: function() {
    this.setState({
      animatedHeight: '0'
    });

    setTimeout(function() {
      this.refs.body.value = '';
      this.setState({
        animatedHeight: null
      });
    }.bind(this), 200);
  },
  constructQuote: function(data) {
    if (!this.refs.body || !data) {
      return false;
    }

    data.body = data.body
      .replace(/^/, "> ")
      .replace(/\n/g, "\n> ")

    var quote = `
      > ${data.author} wrote:

      ${data.body}
    `;

    this.refs.body.value = quote
      .replace(/^\s+/g,'')
      .replace(/\n +/,'\n');

    this.handleFocus();
  },

  handleFocus: function(event) {
    scroll(0, document.body.scrollHeight);
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var postState = {
      parent: this.props.parent,
      title: this.refs.title && this.refs.title.value,
      body: this.refs.body.value
    };

    this.setState({
      restrictSubmit: true
    });

    request.post('/api/posts')
      .send(postState)
      .end(function(error, response) {
        this.props.store.dispatch({
          type: 'NEW',
          value: response.body
        });

        this.setState({
          restrictSubmit: false
        });

        this.animateSubmission();
      }.bind(this));
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

  renderBody: function() {
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
      ></textarea>
    )
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.renderTitle()}
        {this.renderBody()}
        {this.constructQuote(this.props.receivedQuote)}
        <button
          ref="button"
          className="focusAction action action--alwaysOn"
          type="submit"
        >
          Submit Post
        </button>
      </form>
    )
  }
});

module.exports = React.createClass({
  render: function() {
    return (
      <NewTopic
        receivedQuote={this.props.receivedQuote}
        store={window.store}
        parent={this.props.parent}
      />
    );
  }
});

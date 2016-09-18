var React = require('react');
var ReactDOM = require('react-dom');
var request = require('superagent');
var doPosts = require('../reducer-posts');

var NewTopic = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();

    var postState = {
      title: this.refs.title.value,
      body: this.refs.body.value
    };

    request.post('/api/posts')
      .send(postState)
      .end(function(error, response) {
        this.props.store.dispatch({type: 'NEW', value: response.body});
      }.bind(this));
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Title"
          ref="title"
        />
        <input
          className="input"
          type="text"
          placeholder="Body"
          ref="body"
        />
        <button
          className="newInput"
          type="submit"
          style={{
            textAlign: "center",
            display: "block",
            margin: "auto"
          }}
        >
          <span className="accent">
            {'{'}
          </span>
          Submit Post
          <span className="accent">
            {'}'}
          </span>
        </button>
      </form>
    )
  }
});

module.exports = React.createClass({
  render: function() {
    return (
      <NewTopic
        store={window.store}
      />
    );
  }
});

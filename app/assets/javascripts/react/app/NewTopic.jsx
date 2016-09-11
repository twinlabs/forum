var React = require('react');
var ReactDOM = require('react-dom');
var request = require('superagent');
var doPosts = require('../reducer-posts');

module.exports = React.createClass({
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
          className="input"
          type="submit"
        >
          Submit
        </button>
      </form>
    )
  }
});

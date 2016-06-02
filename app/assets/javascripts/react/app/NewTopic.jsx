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
        window.store.dispatch({type: 'NEW', value: response.body});
      });
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="input">
          <input
            type="text"
            placeholder="Title"
            ref="title"
          />
          <input
            type="text"
            placeholder="Body"
            ref="body"
          />
        </div>
        <button type="submit">
          Submit
        </button>
      </form>
    )
  }
});

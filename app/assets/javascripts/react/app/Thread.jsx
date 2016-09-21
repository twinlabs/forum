var React = require('react');
var ReactDOM = require('react-dom');
var request = require('superagent');
var marked = require('marked');
var moment = require('moment');
var Link = require('react-router').Link;
var NewPost = require('./NewPost.jsx');

function setupMarked() {
  var markedRenderer = new marked.Renderer();
  markedRenderer.link = function(href, title, text) {
    return `
      <a
        target="_blank"
        href="${href}"
        ${(title ? 'title="' + title + '"' : '')}
      >
        ${text}
      </a>`
    ;
  };
  var lexer = new marked.Lexer();
  lexer.rules.heading = { exec: function() {} };

  marked.lexer = lexer;

  marked.setOptions({
    emoji: function (emoji) {
      return '<img src="'
          + 'http://cloud.ahfr.org/images/emoji/'
          + encodeURIComponent(emoji)
          + '.png"'
          + ' alt=":'
          + escape(emoji)
          + ':"'
          + ' title=":'
          + escape(emoji)
          + ':"'
          + ' class="emoji" align="absmiddle" height="20" width="20">';

    },
    breaks: true,
    renderer: markedRenderer
  });
}

function renderAsHTML(input) {
  return {
    __html: marked(input)
  };
}

setupMarked();

var Thread = React.createClass({
  getInitialState: function(){
    return {
      posts: []
    }
  },
  componentWillMount: function() {
    request.get(`/topic/${this.props.id}`)
      .set('Accept', 'application/json')
      .then(function(response){
        for (var i=0; i<response.body.length; i++){
          window.store.dispatch({
            type: 'NEW',
            value: response.body[i]
          });
        }
      }.bind(this), function(error){
        throw new Error(error);
      });
  },

  handleQuote: function(data) {
    return this.setState({
      quote: data
    });
  },

  render: function() {
    return (
      <div
        className="thread"
        data-id={this.props.id}
      >
        {this.props.posts.map(ThreadPostWrapper.bind(this))}
        <NewPost
          parent={this.props.id}
          receivedQuote={this.state.quote}
          store={window.store}
        />
      </div>
    )
  }
});

var ThreadPostWrapper = function(postData) {
  return (
    <ThreadPost
      handleQuote={this.handleQuote}
      key={postData.id}
      {...postData}
    />
  );
}

var ThreadPost = React.createClass({
  sendQuote: function(event) {
    event.preventDefault();

    return this.props.handleQuote({
      author: this.props.user.name,
      body: this.props.body
    });
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
          dangerouslySetInnerHTML={renderAsHTML(this.props.body)}
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

module.exports = Thread;

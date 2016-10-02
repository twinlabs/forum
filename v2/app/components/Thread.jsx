var React = require('react');
var marked = require('marked');
var NewPost = require('./NewPost.jsx');
var ThreadPost = require('./ThreadPost.jsx');

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

setupMarked();

var Thread = React.createClass({
  getInitialState: function(){
    return {
      posts: []
    }
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
        {this.props.renderLoadMore()}
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

var ThreadPostWrapper = function(postData, index) {
  return (
    <ThreadPost
      handleQuote={this.handleQuote}
      key={index}
      marked={marked}
      {...postData}
    />
  );
}

module.exports = Thread;

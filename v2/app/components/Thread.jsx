var React = require('react');
var NewPost = require('./NewPost.jsx');
var ThreadPost = require('./ThreadPost.jsx');

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
      contentRenderer={require('./markdownInitializer')}
      forumUser={window.forum.constants.user}
      {...postData}
    />
  );
}

module.exports = Thread;

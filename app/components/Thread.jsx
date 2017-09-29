var React = require('react');
var createReactClass = require('create-react-class');
var NewPost = require('./NewPost.jsx');
var ThreadPost = require('./ThreadPost.jsx');
var _ = require('lodash/core');

var Thread = createReactClass({
  displayName: 'Thread',

  shouldComponentUpdate: function(nextProps, nextState) {
    if (
      _.isEqual(this.state, nextState)
      && _.isEqual(this.props, nextProps)
    ) {
      return false;
    }

    return true;
  },

  getInitialState: function(){
    return {
      posts: []
    }
  },

  componentDidMount: function () {
    document.title = this.props.title;
  },

  componentWillUnmount: function() {
    document.title = 'Forum';
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
          location={this.props.location}
        />
      </div>
    )
  },
});

var ThreadPostWrapper = function(postData, index) {
  return (
    <ThreadPost
      handleQuote={this.handleQuote}
      key={postData.id}
      contentRenderer={require('./markdownInitializer')}
      forumUser={window.forum.constants.user}
      settings={this.props.settings}
      {...postData}
    />
  );
}

module.exports = Thread;

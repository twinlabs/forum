var React = require('react');
var ReactDOM = require('react-dom');
var Preify = require('./Preify.jsx');
var PostControls = require('./PostControls.jsx');

var Post = React.createClass({
  getInitialState: function() {
    return {
      isEditing: false
    };
  },

  handleShowEdit: function() {
    this.setState({
      isEditing: true
    });
  },

  handleFinishEdit: function() {
    this.setState({
      isEditing: false
    });
  },

  showContent: function () {
    if (this.state.isEditing) {
      return (
        <textarea
          className="input"
          defaultValue={JSON.stringify(this.props)}
        />
      )
    }

    return (
      <Preify>
        {JSON.stringify(this.props)}
      </Preify>
    )
  },

  showControls: function() {
    if (this.state.isEditing) {
      return (
        <button
          className="input"
          onClick={this.handleFinishEdit}
        >
          Done
        </button>
      );

    }

    return (
      <PostControls
        post={this.props}
        handleShowEdit={this.handleShowEdit}
      />
    );
  },

  render: function() {
    return (
      <div className="post">
        {this.showContent()}
        {this.showControls()}
      </div>
    )
  }
});

module.exports = function(postData) {
  return (
    <Post
      key={postData && (postData.id + postData.title)}
      {...postData}
    />
  );
}

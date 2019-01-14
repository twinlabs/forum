var React = require('react');
var createReactClass = require('create-react-class');
var browserHistory = require('react-router').browserHistory;

var ControlBar = createReactClass({
  displayName: 'ControlBar',

  getInitialState: function() {
    return {
      lastTapped: +new Date(),
    };
  },

  detectDoubleTap: function(event) {
    const delay = +new Date() - this.state.lastTapped;

    if (delay < 300) {
      this.props.handleRootRefresh(event);
    }

    this.setState({
      lastTapped: +new Date(),
    });
  },

  handleRightControl: function(event) {
    event.preventDefault();

    return scroll(0, document.body.scrollHeight);
  },

  render: function() {
    return (
      <div className="controlBar">
        <a
          className="controlBar-control settingsControl"
          href="/settings"
          onClick={function(event) {
            event.preventDefault();
            browserHistory.push('/settings');
          }}
          title="User settings"
        >
          Settings
        </a>
        <a
          href="/"
          onClick={this.props.handleRootNavigation}
          onDoubleClick={this.props.handleRootRefresh}
          onTouchStart={this.detectDoubleTap}
          className="controlBar-control controlBar-title"
          title={this.props.title}
        >
          {this.props.title}
        </a>
        <a
          className=" controlBar-control newPostControl"
          href="/topic/new"
          onClick={this.handleRightControl}
          title="Create a new post"
        >
          New
        </a>
      </div>
    );
  },
});

module.exports = ControlBar;

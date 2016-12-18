var React = require('react');
var browserHistory = require('react-router').browserHistory;

var ControlBar = React.createClass({
  getInitialState: function() {
    return {
      lastTapped: +new Date()
    }
  },

  detectDoubleTap: function(event) {
    const delay = (+new Date()) - this.state.lastTapped;

    if (delay < 300) {
      this.props.handleRootRefresh(event)
    }

    this.setState({
      lastTapped: +new Date()
    });
  },

  handleRightControl: function(event) {
    event.preventDefault();

    return scroll(0, document.body.scrollHeight);
  },

  render: function() {
    return (
      <div
        className="controlBar"
      >
        <a
          className="controlBar-control settingsControl"
          href="/settings"
          onClick={function(event){
            event.preventDefault();
            browserHistory.push('/settings');
          }}
        >
          Settings
        </a>
        <a
          href="/"
          onClick={this.props.handleRootNavigation}
          onDoubleClick={this.props.handleRootRefresh}
          onTouchStart={this.detectDoubleTap}
          className="controlBar-control controlBar-title"
        >
          {this.props.title}
        </a>
        <a
          className=" controlBar-control newPostControl"
          href="/topic/new"
          onClick={this.handleRightControl}
        >
          New
        </a>
      </div>
    )
  }
});

module.exports = ControlBar;

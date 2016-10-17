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

    if (window.location.pathname.match('/topic/') !== null) {
      return scroll(0, document.body.scrollHeight);
    }

    return browserHistory.push('/v2/topic/new');
  },

  render: function() {
    return (
      <div
        className="controlBar"
      >
        <a
          className="controlBar-control settingsControl"
          href="/v2/settings"
          onClick={function(event){
            event.preventDefault();
            browserHistory.push('/v2/settings');
          }}
        >
          &hellip;
        </a>
        <a
          href="/v2"
          onClick={this.props.handleRootNavigation}
          onDoubleClick={this.props.handleRootRefresh}
          onTouchStart={this.detectDoubleTap}
          className="controlBar-control controlBar-title"
          style={{
            fontSize: "32px",
            textAlign: "center"
          }}
        >
          {this.props.title}
        </a>
        <a
          className=" controlBar-control newPostControl"
          href="/v2/topic/new"
          onClick={this.handleRightControl}
        >
          +
        </a>
      </div>
    )
  }
});

module.exports = ControlBar;

var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;

var ControlBar = React.createClass({
  render: function() {
    return (
      <div
        className="controlBar"
      >
        <a
          className="settingsControl"
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
          onClick={function(event){
            event.preventDefault();
            browserHistory.push('/v2');
          }}
          className="controlBar-title"
          style={{
            fontSize: "32px",
            textAlign: "center"
          }}
        >
          {this.props.title}
        </a>
        <a
          className="newPostControl"
          href="/v2/topic/new"
          onClick={handleRightControl.bind(this)}
        >
          +
        </a>
      </div>
    )
  }
});

function handleRightControl(event) {
  event.preventDefault();

  if (window.location.pathname.match('/topic/') !== null) {
    return scroll(0, document.body.scrollHeight);
  }

  return browserHistory.push('/v2/topic/new');
}

module.exports = ControlBar;

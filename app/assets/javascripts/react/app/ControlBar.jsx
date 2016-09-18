var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;

var ControlBar = React.createClass({
  render: function() {
    return (
      <div
        className="controlControlBar"
      >
        <a
          href="/react"
          onClick={function(event){
            event.preventDefault();
            browserHistory.push('/react');
          }}
          className="controlBar"
          style={{
            fontSize: "32px",
            textAlign: "center"
          }}
        >
          Forum
        </a>
        <a
          className="newPostControl"
          href="/react/topic/new"
          onClick={function(event) {
            event.preventDefault();
            browserHistory.push('/react/topic/new');
          }}
        >
          +
        </a>
        <a
          className="settingsControl"
          href="/react/settings"
          onClick={function(event){
            event.preventDefault();
            browserHistory.push('/react/settings');
          }}
        >
          &hellip;
        </a>
      </div>
    )
  }
});

module.exports = ControlBar;

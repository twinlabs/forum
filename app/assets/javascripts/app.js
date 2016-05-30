var React = require('react');
var ReactDOM = require('react-dom');
var ControlBar = require('./app/ControlBar.jsx');

function etc() {
  return (
    <div>
      <ControlBar
        appName={'The Forum'}
      />
    </div>
  )
}

ReactDOM.render(etc(), document.getElementById('app'), function() {
  document.getElementsByClassName('body')[0].classList.remove('is-loading');
});

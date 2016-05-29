var React = require('react');
var ReactDOM = require('react-dom');
var ControlBar = require('./app/ControlBar.jsx');

function etc() {
  return (
    <div>
      <h1>
        The Forum,
        now in <kbd>react</kbd>
      </h1>
      <ControlBar
        imagine={'Tupac.'}
      />
    </div>
  )
}

ReactDOM.render(etc(), document.getElementById('app'));

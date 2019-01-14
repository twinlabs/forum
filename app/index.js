var React = require('react');
var ReactDOM = require('react-dom');
var redux = require('redux');
var Root = require('./components/index.jsx');
var reducerRoot = require('./reducer-root');
require('./reducer-connections');

function render() {
  ReactDOM.render(
    <Root value={window.store.getState()} />,
    document.getElementById('app'),
    function() {
      document.body.classList.remove('is-loading');
    },
  );
}

window.store = redux.createStore(reducerRoot);

window.store.subscribe(render);

render();

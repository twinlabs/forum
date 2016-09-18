var _ = require('lodash/core');
var React = require('react');
var ReactDOM = require('react-dom');
var redux = require('redux');
var Root = require('./Root.jsx')
var rootReducer = require('./reducer-root');

function render() {
  ReactDOM.render(
    <Root value={store.getState()} />,
    document.getElementById('app'),
    function() {
      document.body.classList.remove('is-loading');
    }
  );
}

window.store = redux.createStore(rootReducer);

store.subscribe(render);

render();

// set up sockets

var io = require('socket.io-client');

window.socket = io.connect(forum.constants.socketAddress, {
  query: {
    user: JSON.stringify(forum.constants.user)
  }
});

socket.on('destroy', function(response){
  window.store.dispatch({
    type: 'REMOVE',
    value: response.id
  });
});

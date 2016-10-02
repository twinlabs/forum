var React = require('react');
var ReactDOM = require('react-dom');
var redux = require('redux');
var Root = require('./components/index.jsx')
var rootReducer = require('./reducer-root');

function render() {
  ReactDOM.render(
    <Root value={window.store.getState()} />,
    document.getElementById('app'),
    function() {
      document.body.classList.remove('is-loading');
    }
  );
}

window.store = redux.createStore(rootReducer);

window.store.subscribe(render);

render();

// set up sockets

var io = require('socket.io-client');

window.socket = io.connect(window.forum.constants.socketAddress, {
  query: {
    user: JSON.stringify(window.forum.constants.user)
  }
});

window.socket.on('post', function(response) {
  window.store.dispatch({
    type: 'NEW',
    value: response
  });
});

window.socket.on('destroy', function(response){
  window.store.dispatch({
    type: 'REMOVE',
    value: response.id
  });
});

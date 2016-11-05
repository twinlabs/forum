var React = require('react');
var ReactDOM = require('react-dom');
var redux = require('redux');
var Root = require('./components/index.jsx')
var reducerRoot = require('./reducer-root');
var Favico = require('favico.js');

function render() {
  ReactDOM.render(
    <Root value={window.store.getState()} />,
    document.getElementById('app'),
    function() {
      document.body.classList.remove('is-loading');
    }
  );
}

window.store = redux.createStore(reducerRoot);

window.store.subscribe(render);

render();

var favicon = new Favico({
  animation: 'none',
  bgColor: '#ff0e00',
  color: '#fff'
});

window.addEventListener('blur', function() {
  window.forum.focus = false;
});
window.addEventListener('focus', function() {
  window.forum.focus = true;
  window.forum.replyCount = 0;
  favicon.reset();
})

// set up sockets

var io = require('socket.io-client');

window.socket = io.connect(window.forum.constants.socketAddress, {
  query: {
    user: JSON.stringify(window.forum.constants.user)
  }
});

window.socket.on('post', function(response) {
  if (!window.forum.focus) {
    window.forum.replyCount++;
    favicon.badge(window.forum.replyCount);
  }

  window.store.dispatch({
    type: 'NEW',
    value: response
  });
});

window.socket.on('edit', function(response) {
  window.store.dispatch({
    type: 'EDIT',
    value: response
  });
});

window.socket.on('destroy', function(response){
  window.store.dispatch({
    type: 'REMOVE',
    value: response.id
  });
});

window.socket.on('updateuserlist', function(userList) {
  window.store.dispatch({
    type: 'USERLIST',
    value: userList
  });
});

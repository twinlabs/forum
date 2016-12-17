var io = require('socket.io-client');
var favicon = require('./favicon');

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

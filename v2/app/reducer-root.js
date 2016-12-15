var redux = require('redux');

function handleSettings(state, action) {
  if (typeof state === 'undefined') {
    return Object.assign({}, window.__INITIAL_STATE__.settings, {
      style: localStorage.getItem('forumStyleValue') || 'classic'
    });
  }

  if (action.type === 'SIGCHANGE') {
    return Object.assign({}, state, {
      signature: action.value
    });
  }

  if (action.type === 'VERSION') {
    return Object.assign({}, state, {
      is_v2: action.value
    });
  }

  if (action.type === 'STYLECHANGE') {
    localStorage.setItem('forumStyleValue', action.value);

    return Object.assign({}, state, {
      style: action.value
    });
  }

  return state;
}

function userList(state, action) {
  if (typeof state === 'undefined') {
    return {};
  }

  if (action.type === 'USERLIST') {
    return Object.assign({}, state, action.value);
  }

  return state;
}

module.exports = redux.combineReducers({
  userList: userList,
  topics: require('./reducer-topics'),
  settings: handleSettings
});

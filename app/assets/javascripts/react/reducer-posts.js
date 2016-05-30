module.exports = function doPosts(state, action) {
  if (typeof state ==='undefined') {
    return window.__INITIAL_STATE__.postData;
  }

  if (action.type === 'NEW') {
    return [Object.assign({}, action.value)].concat(state);
  }

  return state;
};


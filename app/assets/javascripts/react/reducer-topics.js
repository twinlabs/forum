var _ = require('lodash/core');

module.exports = function doPosts(state, action) {
  if (typeof state ==='undefined') {
    return window.__INITIAL_STATE__.postData;
  }

  if (action.type === 'REMOVE') {
    var removableIndex = _.map(state, function(post) {
      return post.id;
    }).indexOf(action.value);

    var posts = state.slice(0, removableIndex).concat(state.slice(removableIndex + 1))

    return posts;
  }

  if (action.type === 'NEW') {
    return [Object.assign({}, action.value)].concat(state);
  }

  return state;
};

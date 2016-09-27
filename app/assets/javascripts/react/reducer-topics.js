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

  if (action.type ==='INITIALIZE') {
    return action.value.concat(state);
  }

  if (action.type === 'MARKREAD') {
    // find topic by ID, replace topic entirely,
    // return list of topics.

    const topicIndex = state.findIndex(function(element) {
      return element.id === action.value.id;
    });

    var newTopic = Object.assign({}, action.value);
    newTopic.lastreply.isNew = false;
    var topics = state.slice(0, topicIndex)
      .concat(newTopic, state.slice(removableIndex + 1))

    return topics;
  }

  if (action.type === 'BACKFILL') {
    return action.value.concat(state);
  }

  if (action.type === 'NEW') {
    let newPost = Object.assign({}, action.value, {isNew: true});
    let newState = [].concat(state, newPost);

    if (newPost.parent) {
      let parentPost = _.find(state, {
        id: newPost.parent
      })
      parentPost.lastreply = newPost;
      parentPost.replycount = parseInt(parentPost.replycount, 10) + 1;
    }

    return newState;
  }

  return state;
};

function replaceAtIndex(collection, index, value) {
  return collection.slice(0, index)
    .concat(Object.assign({}, action.value, {isNew: false}), state.slice(removableIndex + 1))
}

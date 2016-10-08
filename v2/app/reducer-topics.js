var _ = require('lodash/core');

module.exports = function doPosts(state, action) {
  var removableIndex;
  if (typeof state ==='undefined') {
    return window.__INITIAL_STATE__.postData;
  }

  if (action.type === 'REINITIALIZE') {
    return action.value;
  }

  if (action.type === 'REMOVE') {
    removableIndex = _.map(state, function(post) {
      return post.id;
    }).indexOf(action.value);

    var posts = state.slice(0, removableIndex).concat(state.slice(removableIndex + 1));

    return posts;
  }

  if (action.type ==='GETTHREAD') {
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
      .concat(newTopic, state.slice(topicIndex + 1));

    return topics;
  }

  if (action.type === 'BACKFILL') {
    return action.value.concat(state);
  }

  if (action.type === 'EDIT') {
    let newPost = Object.assign({}, action.value);

    const postIndex = state.findIndex(function(element) {
      return element.id === action.value.id;
    });

    let posts = state.slice(0, postIndex)
      .concat(newPost, state.slice(postIndex + 1));

    return posts;
  }

  if (action.type === 'NEW') {
    let newPost = Object.assign({}, action.value, {isNew: true});
    let newState = [].concat(state, newPost);

    if (newPost.parent) {
      let parentPost = _.find(state, {
        id: newPost.parent
      });
      parentPost.lastreply = newPost;
      parentPost.replycount = parseInt(parentPost.replycount, 10) + 1;
    }

    return newState;
  }

  return state;
};

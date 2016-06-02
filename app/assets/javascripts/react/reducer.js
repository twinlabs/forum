var redux = require('redux');
var doPosts = require('./reducer-posts');

var names = [
  'The Forum',
  'Ethix Skeptro Viewpoint Simulator',
  'Masked Terror #3 Hatchery',
  'Funk Docta Bombay Mortuary',
  'Jason Gloss War Tribunal',
  'Will High Observatory'
]

function nameChange(state, action) {
  if (state === 'undefined') {
    return names[0];
  }

  return names[Math.floor(Math.random() * names.length)];
}

function getSettings(state, action) {
  return window.__INITIAL_STATE__.settings;
}


module.exports = redux.combineReducers({
  appName: nameChange,
  posts: doPosts,
  settings: getSettings
});

var redux = require('redux');

var names = [
  'The Forum',
  'Jason Gloss War Tribunal',
  'Will High Observatory'
]

function nameChange(state, action) {
  if (state === 'undefined') {
    return names[0];
  }

  return names[Math.floor(Math.random() * names.length)];
}


module.exports = redux.combineReducers({
  appName: nameChange
});

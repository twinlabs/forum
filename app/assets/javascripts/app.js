var _ = require('lodash/core');
var React = require('react');
var ReactDOM = require('react-dom');
var redux = require('redux');
var Root = require('./Root.jsx')

var initialState = {
  appName: 'The Forum'
}


var names = [
  'Jason Gloss War Tribunal',
  'Will High Observatory',
  'The Forum'
]

function nameChange(state, action) {
  return Object.assign({}, state, {
    appName: names[Math.floor(Math.random() * names.length)]
  });
}

function reducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  if (action.type === 'NAMECHANGE') {
    return nameChange(state, action);
  }

  return state;
}

function render() {
  ReactDOM.render(
    <Root value={store.getState()} />,
    document.getElementById('app'),
    function() {
      document.getElementsByClassName('body')[0].classList.remove('is-loading');
    }
  );
}

var store = redux.createStore(reducer);

store.subscribe(render);

setInterval(function() {
  store.dispatch({
    type: 'NAMECHANGE'
  });
}, 1000)

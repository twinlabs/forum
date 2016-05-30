var _ = require('lodash/core');
var React = require('react');
var ReactDOM = require('react-dom');
var redux = require('redux');
var Root = require('./Root.jsx')

var initialState = {
  appName: 'The Forum'
}

function reducer(state, action) {
  if (typeof state === 'undefined') {
    console.log(initialState);
    return initialState;
  }

  if (action.type === 'NAMECHANGE') {

  }

  console.log(state);
  return Object.assign({}, state, {
  });
}

var store = window.store = redux.createStore(reducer);

ReactDOM.render(
  <Root value={store.getState()} />,
  document.getElementById('app'),
  function() {
    document.getElementsByClassName('body')[0].classList.remove('is-loading');
  }
);

setInterval(function() {
  store.dispatch({type: 'NAMECHANGE'});
}, 1000)

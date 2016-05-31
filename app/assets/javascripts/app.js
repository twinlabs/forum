var _ = require('lodash/core');
var React = require('react');
var ReactDOM = require('react-dom');
var redux = require('redux');
var Root = require('./Root.jsx')
var forumReducer = require('./reducer');

function render() {
  ReactDOM.render(
    <Root value={store.getState()} />,
    document.getElementById('app'),
    function() {
      document.getElementsByClassName('body')[0].classList.remove('is-loading');
    }
  );
}

var store = redux.createStore(forumReducer);

store.subscribe(render);

render();

setInterval(function() {
  store.dispatch({
    type: 'NAMECHANGE'
  });
}, 1000)

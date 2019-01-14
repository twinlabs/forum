var Favico = require('favico.js');

var favicon = new Favico({
  animation: 'none',
  bgColor: '#ff0e00',
  color: '#fff',
});

window.addEventListener('blur', function() {
  window.forum.focus = false;
});
window.addEventListener('focus', function() {
  window.forum.focus = true;
  window.forum.replyCount = 0;
  favicon.reset();
});

module.exports = favicon;

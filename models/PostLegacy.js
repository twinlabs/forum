var Post = function(parent) {
  'use strict';
  this.id = utils.makeID(this.className.toLowerCase() + '_');
  this.parent = (function() {
    if (parent) return parent;
    return false;
  })();
  this.userid = global.session.user.id;
  Post._list.push(this);
};

Post.prototype.className = 'Post';
Post._list = [];
Post.findOne = function(id) {
  for (var i = 0; Post._list.length; i++) {
    if (id === Post._list[i].id) return Post._list[i];
  }
};

module.exports = Post;

var utils = (function() {
  'use strict';
  var idCounter = 0;

  return {
    makeID: function(prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    },
  };
})();

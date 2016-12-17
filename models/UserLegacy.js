var User = function(){
  "use strict";
  this.posts = [];
  this.id = "1"; // get this from the datastore...
  this.name = "new user";
  this.displayName = this.name;
};

User.prototype.className = 'User';

module.exports = User;

var user = rootRequire('app/models/User');
var Sequelize = require('sequelize');

var UserController = {
  get: function(id) {
    return user.find(id);
  },
  updateLastVisited: function(id, topicID) {
    this.get(id).then(function(userInstance) {
      var lastVisited = userInstance.get('last_visited') || {};

      lastVisited[topicID] = +new Date();

      return user.update({
        last_visited: lastVisited
      }, {
        where: {
          id: id
        }
      });
    });

  }
};

module.exports = UserController;

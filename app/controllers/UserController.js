var user = rootRequire('app/models/User');
var PostsController = rootRequire('app/controllers/PostsController');
var Sequelize = require('sequelize');

var UserController = {
  get: function(id) {
    return user.find(id);
  },
  getLastVisited: function(id) {
    return this.get(id).then(function(userInstance) {
      return userInstance.get('last_visited');
    });
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

  },

  markAllRead: function(data) {
    PostsController.topics().then(function(topics) {
      var date = + new Date();
      var lastVisited = {};

      topics.forEach(function(topic) {
        lastVisited[topic.id] = date;
      });

      user.update({
        last_visited: lastVisited
      }, {
        where: {
          id: data.user.id
        }
      });
    });
  }
};

module.exports = UserController;

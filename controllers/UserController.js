var user = rootRequire('models/User');
var PostsController = rootRequire('controllers/PostsController');

var UserController = {
  get: function(id) {
    return user.findById(id);
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
        },
        logging: false,
      });
    });

  },

  markAllUnread: function(data) {
    return PostsController.topics().then(function(topics) {
      user.update({
        last_visited: null
      }, {
        where: {
          id: data.user.id
        }
      });
    });
  },

  markAllRead: function(data) {
    return PostsController.topics().then(function(topics) {
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

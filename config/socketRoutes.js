var PostsController = rootRequire('controllers/PostsController');
var UserController = rootRequire('controllers/UserController');
var userlist = {};

module.exports = function(app) {
  app.get('io').sockets.on('connection', function(socket) {
    if (typeof socket.handshake.query.user === 'undefined') {
      socket.handshake.query.user = '{}';
    }

    var user = JSON.parse(socket.handshake.query.user);

    if (user.id && user.id !== 0) {
      UserController.get(user.id).then(function(userData) {
        if (!userData.hide_connected) {
          userlist[user.name] = {
            name: user.name,
          };
        }

        app.get('io').sockets.emit('updateuserlist', userlist);
      });
    }

    socket.on('post', function(data, callback) {
      data.user_id = data.user.id;

      if (data.user_id === 0) {
        return false;
      }

      data.created_at = new Date();

      PostsController.add(data, function(result) {
        data.id = result.id;
        app.get('io').sockets.emit('post', data);

        UserController.updateLastVisited(data.user.id, data.parent);

        if (typeof callback === 'function') {
          callback();
        }
      });
    });

    socket.on('edit', function(data) {
      data.user_id = data.user.id;
      app.get('io').sockets.emit('edit', data);

      if (data.user_id === 0) {
        return false;
      }

      PostsController.edit(data);
    });

    socket.on('destroy', function(data) {
      data.user_id = data.user.id;
      app.get('io').sockets.emit('destroy', data);

      if (data.user_id === 0) {
        return false;
      }

      PostsController.destroy(data);
    });

    socket.on('markallread', function(data, callback) {
      data.user_id = data.user.id;

      if (data.user_id === 0) {
        return false;
      }

      UserController.markAllRead(data);
    });

    socket.on('disconnect', function() {
      if (user.name) {
        delete userlist[user.name];
        app.get('io').sockets.emit('updateuserlist', userlist);
      }
    });
  });
};

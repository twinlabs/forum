var PostsController = rootRequire('app/controllers/PostsController');

var routes = function(app, passport){
  app.all('*', function(request, response, next){
    if (typeof request.session.user === "undefined") {
      request.session.user = {
          id: 0,
        name: 'Anonymous'
      };
    }

    response.locals.user = request.session.user;

    next();
  });

  app.get('/', function(request, response){
    response.render('index', {});
  });

  app.get('/all', function(request, response){
    if (request.session.user.id === 0){
      return response.send(404);
    }

    PostsController.index().done(function(error, posts){
      response.render('all', {
        posts: posts
      });
    });
  });

  // TODO: what follows isn't isn't a proper route,
  // it's a socket/event binding.
  // take some time to think about where this ought to live.
  // probably in the PostsController module.
  app.get('io').sockets.on('connection', function(socket){
    socket.on('post', function(data){
      data.user_id = data.user.id;

      if (data.user_id === 0) {
        return false;
      }

      PostsController.add(data, function(error, result){
        data.id = result.id;
        app.get('io').sockets.emit('post', data);
      });
    });

    socket.on('edit', function(data){
      data.user_id = data.user.id;
      app.get('io').sockets.emit('edit', data);

      if (data.user_id === 0) {
        return false;
      }

      PostsController.edit(data);
    });

    socket.on('destroy', function(data){
      data.user_id = data.user.id;
      app.get('io').sockets.emit('destroy', data);

      if (data.user_id === 0) {
        return false;
      }

      PostsController.destroy(data);
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {}), function(request, response, next){
    response.redirect('/login');
  });

  app.post('/login', passport.authenticate('local'), function(request, response, next){
    request.session.user = {
        id: request.user && request.user.id || '',
      name: request.user && request.user.name || ''
    };

    response.redirect('/all');
  });

  app.get('/logout', function(request, response){
    request.session.destroy();

    response.redirect('/');
  });


  app.get('/login', function(request, response){
    response.render('login', {
    });
  });

  app.get('/signup', function(request, response){
    response.render('signup', {
    });
  });

  app.get('/sandbox/topics', function(request, response){
    response.render('sandbox/topics', {
      posts: rootRequire('test/fixtures/topics')
    });
  });

  app.get('/sandbox/topic', function(request, response){
    response.render('sandbox/topic', {
      posts: rootRequire('test/fixtures/posts')
    });
  });
};

module.exports = routes;

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
    PostsController.index().done(function(error, posts){
      response.render('index', {
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
      app.get('io').sockets.emit('post', data);

      if (data.user_id === 0) {
        return false;
      }

      PostsController.add(data);
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {}), function(request, response, next){
    response.send(200);
  });

  app.post('/login', passport.authenticate('local'), function(request, response, next){
    request.session.user = {
        id: request.user && request.user.id || '',
      name: request.user && request.user.name || ''
    };

    response.send(200);
  });

  app.get('/login', function(request, response){
    response.render('login', {
    });
  });

  app.get('/signup', function(request, response){
    response.render('signup', {
    });
  });

  app.get('/uisandbox', function(request, response){
    response.render('posts/show', {
      posts: rootRequire('test/fixtures/posts')
    });
  });
};

module.exports = routes;

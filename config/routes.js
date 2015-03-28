var PostsController = rootRequire('app/controllers/PostsController');
var UserController = rootRequire('app/controllers/UserController');
var authentication = rootRequire('lib/authentication');

var routes = function(app, passport){
  app.all('*', function(request, response, next){
    if (typeof request.session.user === "undefined") {
      request.session.user = {
          id: 0,
        name: 'Anonymous'
      };
    }

    response.locals.user = request.session.user;

    if (
      app.get('hostName')
        .match(request.get('host')
          .split(':')[0]
       ) === null
    ) {
      return response.redirect(301, app.get('hostName') + request.url);
    }

    next();
  }, function(request, response, next) {
    if (request.session.user.id === 0){
      return next();
    }


    var assetPaths = ['stylesheets', 'javascripts', 'templates', 'fonts', 'images'];

    // skip "last visited" lookup if the request is obviously just for an asset:
    for (var i = 0; i < assetPaths.length; i++) {
      if (request.originalUrl.indexOf(assetPaths[i]) !== -1) {
        return next();
      }
    }


    UserController.getLastVisited(request.session.user.id).then(function(lastVisited) {
      response.locals.lastVisited = lastVisited || {};

      next();
    });
  });

  app.get('/lastVisited', function(request, response) {
    response.send(response.locals.lastVisited);
  });

  app.get('/', function(request, response){
    if (request.session.user.id === 0){
      return response.render('index', {});
    }

    if (app.get('lastModifiedIndex') && request.get('If-Modified-Since') &&
      (new Date(request.get('If-Modified-Since')).getTime() >= new Date(app.get('lastModifiedIndex')).getTime())
    ) {

      return response.send(304);
    }


    if (app.get('lastModifiedIndex')) {
      response.set('Last-Modified', app.get('lastModifiedIndex'));
    }


    if (typeof app.get('lastModifiedIndex') === "undefined") {
      app.set('lastModifiedIndex', new Date().toString());
    }

    PostsController.topics().done(function(error, posts){
      response.render('index', { posts: posts });
    });

  });

  app.get('/topic/:id', function(request, response, next) {
    if (request.session.user.id === 0){
      return response.render('index', {});
    }

    if (request.query.all) {
      return PostsController.postsForTopicAll(request.params.id).done(function(error, posts) {
        if (posts && posts.length < 1) {
          return response.send(404);
        }

        response.render('all', {
          posts: posts,
          parent: request.params.id
        });
      });
    }
    if (request.query.limit) {
      return PostsController.postsForTopic(response.locals.lastVisited[request.params.id] || +new Date(null), request.params.id, request.query.limit).then(function(posts){

        if (posts.rows && posts.rows.length < 1) {
          return response.send(404);
        }

        PostsController.findTopicTitle(request.params.id).spread(function(topic) {
          response.render('all', {
            posts: posts.rows.reverse(),
            parent: request.params.id,
            count: posts.count,
            topic: topic[0],
            limit: parseInt(request.query.limit, 10) || 20
          });
        });
      });

    }

    return next();

  }, function(request, response, next) {
    if (request.session.user.id === 0){
      return response.render('index', {});
    }

    UserController.updateLastVisited(request.session.user.id, request.params.id);

    next();
  }, function(request, response) {
    if (request.session.user.id === 0){
      return response.render('index', {});
    }

    PostsController.postsForTopic(response.locals.lastVisited[request.params.id] || +new Date(null), request.params.id).then(function(posts){

      if (posts.rows && posts.rows.length < 1) {
        return response.send(404);
      }

      PostsController.findTopicTitle(request.params.id).spread(function(topic) {
        response.render('all', {
          posts: posts.rows.reverse(),
          parent: request.params.id,
          topic: topic[0],
          count: posts.count
        });
      });
    });
  });

  app.get('/post/:id', function(request, response){
    // if the user isn't logged in, return a 404:
    if (request.session.user.id === 0) {
      response.send(404);
    }

    //look up post id based on get request
    //return post data using response.send which should return the markdown you need to quote the post
    PostsController.get(request.params.id).done(function(err, post){
      response.send(post);
    });
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
    socket.on('post', function(data, callback) {
      data.user_id = data.user.id;

      if (data.user_id === 0) {
        return false;
      }

      data.created_at = new Date();

      PostsController.add(data, function(error, result){
        data.id = result.id;
        app.get('io').sockets.emit('post', data);

        app.set('lastModifiedIndex', new Date());

        if (typeof callback === "function") {
          callback();
        }
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

    socket.on('markallread', function(data, callback) {
      data.user_id = data.user.id;

      if (data.user_id === 0) {
        return false;
      }

      UserController.markAllRead(data);
    });
  });

  app.post('/signup', tokenValidation, passport.authenticate('local-signup', {}), function(request, response, next){
    response.redirect('/login');
  });

  app.post('/login', passport.authenticate('local'), function(request, response, next){
    request.session.user = {
        id: request.user && request.user.id || '',
      name: request.user && request.user.name || ''
    };

    response.redirect('/');
  });

  app.get('/settings', function(request, response){
    if (request.session.user.id === 0) {
      response.send(404);
    }
    UserController.get(request.session.user.id).done(function(err, user){
      response.render('settings', {
        user: user
      });
    });
  });

  app.post('/settings', function(request, response){
    UserController.get(request.session.user.id)
    .done(function(err, user){
      user.updateAttributes(request.body).success(function(){
        response.render('settings', {
          user: user
        });
      });
    });
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

function tokenValidation(request, response, next){
  // this function is middleware for the '/signup' endpoint.
  var token;

  if (!request.files || !request.body) {
    // if there's a mis-match, respond with something elegant:
    return response.send(401);
  }

  // start with the assumption that the token's file is on request.body:
  token = request.body.token;

  // if it's not on body, we're probably dealing with a file descriptor.
  // grab the file at the given path of the file:
  if (typeof token === "undefined") {
    token = require('fs').readFileSync(request.files.token.path);
  }

  // whatever the file turned out to be,
  // test it against our token:
  if (!authentication.validateSignupToken(token)) {
    return response.send(401);
  }

  // otherwise, the token must have matched.
  // it's safe to pass it along to the next request.
  return next();
}

module.exports = routes;

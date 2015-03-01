var _ = require('lodash');
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

    UserController.getLastVisited(request.session.user.id).then(function(lastVisited) {
      response.locals.lastVisited = lastVisited || {};

      next();
    });
  });

  app.get('/', function(request, response){
    if (request.session.user.id === 0){
      return response.render('index', {});
    }

    PostsController.countTopics().spread(function(countResult) {
      var limit = request.query.all ? 'ALL' : 7;

      PostsController.topics().done(function(error, posts){
        posts = _.first(_.sortBy(posts, function(post) {
          if (post.children[0]) {
            return post.children[0].created_at;
          }

          return post.created_at;
        }).reverse(), limit === 'ALL' ? posts.length : limit);

        response.render('index', {
          posts: posts,
          count: countResult[0].count,
          showFetchButton: !request.query.all
        });
      });
    });

  });

  app.get('/topic/:id', function(request, response, next) {
    if (!request.query.all) {
      return next();
    }

    PostsController.postsForTopicAll(request.params.id).done(function(error, posts){
      if (posts && posts.length < 1) {
        return response.send(404);
      }

      response.render('all', {
        posts: posts,
        parent: request.params.id
      });
    });
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

    PostsController.countPostsForTopic(request.params.id).spread(function(countResult) {
      PostsController.postsForTopic(response.locals.lastVisited[request.params.id], request.params.id).then(function(posts){
        if (posts && posts.length < 1) {
          return response.send(404);
        }

        response.render('all', {
          posts: posts.reverse(),
          parent: request.params.id,
          count: countResult[0].count
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

  app.get('/profile', function(request, response){
    if (request.session.user.id === 0) {
      response.send(404);
    }
    UserController.get(request.session.user.id).done(function(err, user){
      response.render('profile', {
        user: user
      });
    });
  });

  app.post('/profile', function(request, response){
    UserController.get(request.session.user.id)
    .done(function(err, user){
      user.updateAttributes(request.body).success(function(){
        response.render('profile', {
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

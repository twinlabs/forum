var _ = require('lodash');
var PostsController = rootRequire('app/controllers/PostsController');
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

    next();
  });

  app.get('/', function(request, response){
    if (request.session.user.id === 0){
      return response.render('index', {});
    }

    PostsController.topics().done(function(error, posts){
      posts = _.sortBy(posts, function(post) {
        if (post.children[0]) {
          return post.children[0].created_at;
        }

        return post.created_at;
      }).reverse();

      response.render('index', {
        posts: posts
      });
    });

  });

  app.get('/topic/:id', function(request, response){
    if (request.session.user.id === 0){
      return response.render('index', {});
    }

    PostsController.postsForTopic(request.params.id).done(function(error, posts){
      if (posts && posts.length < 1) {
        return response.send(404);
      }

      response.render('all', {
        posts: posts,
        parent: request.params.id
      });
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

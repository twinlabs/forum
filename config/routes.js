var PostsController = rootRequire('controllers/PostsController');
var UserController =  rootRequire('controllers/UserController');
var authentication =  rootRequire('lib/authentication');

var superagent = require('superagent');

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


    var assetPaths = ['stylesheets', 'javascripts', 'fonts', 'images', '.js', '.png', '.jpg', '.gif'];

    // skip "last visited" lookup if the request is obviously just for an asset:
    for (var i = 0; i < assetPaths.length; i++) {
      if (request.originalUrl.indexOf(assetPaths[i]) !== -1) {
        return next();
      }
    }

    UserController.get(request.session.user.id).then(function(userData) {
      response.locals.user.custom_code = userData.custom_code;
      response.locals.user.is_supporter = userData.is_supporter;

      UserController.getLastVisited(request.session.user.id).then(function(lastVisited) {
        response.locals.lastVisited = lastVisited || {};

        next();
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

  app.get('/embed/twitter/:url', function(request, response, next) {
    superagent.get(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(request.params.url)}&omitscript`
      ).then(function(serviceResponse) {
        response.send(serviceResponse.body);
      }, function(error) {
        console.error(error);
        response.sendStatus(error.status);
      });
  });

  app.get('/embed/instagram/:url', function(request, response, next) {
    superagent.get(
      `https://api.instagram.com/oembed?url=${encodeURIComponent(request.params.url)}&omitscript`
    ).then(function(serviceResponse) {
      response.send(serviceResponse.body)
    }, function(error) {
      console.error(error);
      response.sendStatus(error.status);
    })
  });

  app.get('/embed/soundcloud/:url', function(request, response, next) {
    superagent.get(
      `https://soundcloud.com/oembed`
    )
    .query({
      url: request.params.url,
      format: 'json',
      maxheight: 166
    }).then(function(serviceResponse) {
      response.send(serviceResponse.body)
    }, function(error) {
      console.error(error);
      response.sendStatus(error.status);
    })
  });

  app.get('/*', function(request, response, next){
    if (request.session.user.id === 0){
      return response.render('login', {});
    }

    if (request.header('Accept') === 'application/json') {
      return next();
    }

    var assetPaths = ['stylesheets', 'javascripts', 'fonts', 'images', '.js', '.png', '.jpg', '.gif'];

    // skip lookup if the request is obviously just for an asset:
    for (var i = 0; i < assetPaths.length; i++) {
      if (request.originalUrl.indexOf(assetPaths[i]) !== -1) {
        return next();
      }
    }

    PostsController.topics().done(function(error, posts){
      UserController.get(request.session.user.id).done(function(err, userData){

        var responsePosts = addLastVisited(posts, response.locals.lastVisited);

        response.render('react', {
          postData: JSON.stringify(responsePosts),
          settings: JSON.stringify(userData),
          initialState: JSON.stringify({
            postData: posts,
            settings: userData,
          })
        });
      });
    });
  });

  app.get('/topics', function(request, response) {
    PostsController.topics().done(function(error, posts){
      UserController.get(request.session.user.id).done(function(err, userData){
        var responsePosts = addLastVisited(posts, response.locals.lastVisited);

        return response.json(responsePosts)
      });
    });
  });

  app.get('/topic/:id', function(request, response, next) {
    if (request.session.user.id === 0){
      return response.sendStatus(404);
    }

    if (request.query.limit) {
      return PostsController.postsForTopic(response.locals.lastVisited[request.params.id] || +new Date(null), request.params.id, request.query.limit, request.query.offset).then(function(posts){

        if (posts.rows && posts.rows.length < 1) {
          return response.sendStatus(404);
        }

        PostsController.findTopicTitle(request.params.id).spread(function(topic) {
          UserController.updateLastVisited(request.session.user.id, request.params.id);

          return response.json(posts.rows.reverse())
        });
      });
    }

    return next();

  }, function(request, response, next) {
    UserController.updateLastVisited(request.session.user.id, request.params.id);

    next();
  }, function(request, response) {
    PostsController.postsForTopic(response.locals.lastVisited[request.params.id] || +new Date(null), request.params.id).then(function(posts){

      if (posts.rows && posts.rows.length < 1) {
        return response.sendStatus(404);
      }

      return response.json(posts.rows.reverse());
    });
  });

  app.get('/post/:id', function(request, response){
    // if the user isn't logged in, return a 404:
    if (request.session.user.id === 0) {
      response.sendStatus(404);
    }

    //look up post id based on get request
    //return post data using response.send which should return the markdown you need to quote the post
    PostsController.get(request.params.id).done(function(err, post){
      response.send(post);
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

  app.post('/settings', function(request, response){
    UserController.get(request.session.user.id)
    .done(function(err, user){
      request.body.hide_connected = (request.body.hide_connected === 'true');
      request.body.is_v2 = (request.body.is_v2 === 'true' || request.body.is_v2);

      user.updateAttributes(request.body).success(function(){
        response.send(user);
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
};

function addLastVisited(posts, lastVisitedMap) {
  var returnPosts = posts.slice();

  returnPosts.forEach(function(post) {
    var postTimestamp = +new Date(post.lastreply.created_at);
    var lastVisitedTimestamp = +new Date(lastVisitedMap[post.id]);
    if (postTimestamp > lastVisitedTimestamp) {
      post.lastreply.isNew = true;
    }
  });

  return returnPosts;
}

function tokenValidation(request, response, next){
  // this function is middleware for the '/signup' endpoint.
  var token;

  if (!request.files || !request.body) {
    // if there's a mis-match, respond with something elegant:
    return response.sendStatus(401);
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
    return response.sendStatus(401);
  }

  // otherwise, the token must have matched.
  // it's safe to pass it along to the next request.
  return next();
}

module.exports = routes;

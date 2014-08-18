var PostsController = rootRequire('app/controllers/PostsController');

var routes = function(app){
  app.get('/', function(request, response){
    PostsController.index().done(function(error, posts){
      response.render('index', {
        posts: posts
      });
    });
  });

  app.get('io').sockets.on('connection', function(socket){
    socket.on('post', function(data){

      data.user_id = data.user.id;
      PostsController.add(data);
      app.get('io').sockets.emit('post', data);
    });
  });

  app.get('/uisandbox', function(request, response){
    response.render('posts/show', {
      posts: rootRequire('test/fixtures/posts')
    });
  });
};

module.exports = routes;

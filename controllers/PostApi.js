var Sequelize = require('sequelize');
var UserController = rootRequire('controllers/UserController');
var _ = require('lodash');

var postApi = function(rest, checkAuth) {
  var Post = rootRequire('models/Post.orm')(rest.sequelize);

  var posts = rest.resource({
    model: Post,
    endpoints: ['/api/posts', '/api/posts/:id'],
    actions: ['read', 'list', 'create'],
  });

  posts.all.auth(checkAuth);

  posts.read.send.before(function(req, res, context) {
    context.instance = { post: context.instance };
    context.continue();
  });

  posts.list.fetch.before(function(req, res, context) {
    if (req.query.topic) {
      context.criteria = Sequelize.or(
        { id: req.query.topic },
        { parent: req.query.topic },
      );
    }
    context.continue();
  });

  posts.list.send.before(function(req, res, context) {
    context.instance = { posts: context.instance };
    context.continue();
  });

  posts.create.write.before(function(req, res, context) {
    context.attributes = _.assign({}, context.attributes, req.body);
    context.attributes.user_id = req.session.user.id;
    context.continue();
  });

  posts.create.send.after(function(req, res, context) {
    var data = {
      id: context.instance.id,
      user_id: context.instance.user_id,
      body: context.instance.body,
      title: null,
      parent: context.instance.parent,
      created_at: context.instance.created_at,
      user: {
        id: req.session.user.id,
        name: req.session.user.name,
      },
    };
    rest.app.get('io').sockets.emit('post', data);

    UserController.updateLastVisited(data.user_id, data.parent);
  });

  return posts;
};

module.exports = postApi;

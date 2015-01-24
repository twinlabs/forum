var Sequelize = require('sequelize');

var postApi = function(rest) {
  var Post = rootRequire('app/models/Post.orm')(rest.sequelize);

  var posts = rest.resource({
    model: Post,
    endpoints: ['/api/posts', '/api/posts/:id']
  });

  posts.read.send.before(function(req, res, context) {
    context.instance = { post: context.instance };
    context.continue();
  });

  posts.list.fetch.before(function(req, res, context) {
    if (req.query.topic) {
      context.criteria = Sequelize.or(
        {id: req.query.topic}, { parent: req.query.topic }
      );
    }
    context.continue();
  });

  posts.list.send.before(function(req, res, context) {
    context.instance = { posts: context.instance };
    context.continue();
  });

  return posts;
};

module.exports = postApi;

var topicApi = function(rest, checkAuth) {
  var Post = rootRequire('models/Post.orm')(rest.sequelize);

  var topics = rest.resource({
    model: Post,
    endpoints: ['/api/topics', '/api/topics/:id'],
    actions: ['read', 'list'],
  });

  topics.all.auth(checkAuth);

  topics.list.fetch.before(function(req, res, context) {
    context.criteria = { parent: null };
    context.continue();
  });

  topics.read.fetch.before(function(req, res, context) {
    context.criteria = { parent: null };
    context.continue();
  });

  return topics;
};

module.exports = topicApi;

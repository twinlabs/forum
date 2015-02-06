var topicApi = function(rest, checkAuth) {
  var Post = rootRequire('app/models/Post.orm')(rest.sequelize);

  var topics = rest.resource({
    model: Post,
    endpoints: ['/api/topics', '/api/topics/:id'],
    actions: ['read', 'list', 'create']
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

  topics.create.write.before(function(req, res, context) {
    context.attributes.user_id = req.session.user.id;
    context.continue();
  });

  topics.create.send.after(function(req, res, context) {
    data = {
      id: context.instance.id,
      user_id: context.instance.user_id,
      body: context.instance.body,
      title: context.instance.title,
      created_at: context.instance.created_at,
      user: {
        id: req.session.user.id,
        name: req.session.user.name
      }
    };
    rest.app.get('io').sockets.emit('post', data);
    context.continue();
  });

  return topics;
};

module.exports = topicApi;

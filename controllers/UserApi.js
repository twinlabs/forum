var userApi = function(rest, checkAuth) {
  var User = rootRequire('models/User.orm')(rest.sequelize);

  var users = rest.resource({
    model: User,
    endpoints: ['/api/users', '/api/users/:id'],
    actions: ['read', 'list'],
  });

  users.all.auth(checkAuth);

  users.list.send.before(function(req, res, context) {
    context.instance.forEach(function(user) {
      delete user.dataValues.password;
    });
    context.instance = { users: context.instance };
    context.continue();
  });

  users.read.send.before(function(req, res, context) {
    delete context.instance.dataValues.password;
    context.instance = { user: context.instance };
    context.continue();
  });

  return users;
};

module.exports = userApi;

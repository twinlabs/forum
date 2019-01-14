var Sequelize = require('sequelize');
var sequelize = new Sequelize(
  process.env.FORUM_DATABASE_URL || 'postgres://postgres@localhost/forum',
);

var User = rootRequire('models/User.orm')(sequelize);

module.exports = User;

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL || "postgres://postgres@localhost/forum");

var User = rootRequire('app/models/User.orm')(sequelize);

module.exports = User;

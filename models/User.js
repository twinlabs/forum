var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL || "postgres://postgres@db/forum");

var User = rootRequire('models/User.orm')(sequelize);

module.exports = User;

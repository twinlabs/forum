var Sequelize = require('sequelize');
var sequelize = new Sequelize("postgres://postgres@localhost/forum");

var User = rootRequire('app/models/User.orm')(sequelize);

module.exports = User;

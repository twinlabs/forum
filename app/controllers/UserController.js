var user = rootRequire('app/models/User');
var Sequelize = require('sequelize');

var UserController = {
  get: function(id) {
    return User.find(id);
  }
};

module.exports = UserController;

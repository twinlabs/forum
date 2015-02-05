var user = rootRequire('app/models/User');
var Sequelize = require('sequelize');

var UserController = {
  get: function(id) {
    return user.find(id);
  }
};

module.exports = UserController;

var Sequelize = require('sequelize');

var UserSequelize = function(sequelize){
  var User = sequelize.define('User', {
    // attributes of data model go here:
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len:[1, 15]
        }
    }
  }, {
    // options go here:
  });

  return User;
};

// nodejs modules usually export something
// so that other modules can consume them:
module.exports = UserSequelize;


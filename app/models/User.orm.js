var Sequelize = require('sequelize');

var UserSequelize = function(sequelize){
  var User = sequelize.define('User', {
    // attributes of data model go here:
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len:[1, 30]
      }
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  }, {
    // options go here:
    classMethods: {
      associate: function(models){
        User.hasMany(models.Post, {foreignKey: 'user_id'});
      }
    },
    underscored: true,
    tableName: 'forum_user' // what should this be
  });

  return User;
};

// nodejs modules usually export something
// so that other modules can consume them:
module.exports = UserSequelize;


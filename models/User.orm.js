var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

var UserSequelize = function(sequelize){
  var user = sequelize.define('user', {
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
    },
    custom_code: {
      type: Sequelize.STRING,
    },
    hide_connected: {
      type: Sequelize.BOOLEAN,
    },
    signature: {
      type: Sequelize.STRING
    },
    is_supporter: {
      type: Sequelize.DATE
    },
    is_v2: {
      type: Sequelize.BOOLEAN,
    },
    last_visited: {
      type: Sequelize.JSON
    }
  }, {
    underscored: true,
    tableName: 'forum_user'
  });

  user.associate = function(models){
    user.hasMany(models.post, {foreignKey: 'user_id'});
  };

  user.prototype.isValidPassword = function(password, callback){
    return bcrypt.compare(password, this.password, callback);
  }

  return user;
};

module.exports = UserSequelize;


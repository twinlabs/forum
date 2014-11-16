var Sequelize = require('sequelize');

var PostSequelize = function(sequelize){
  var Post = sequelize.define('Post', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    body: Sequelize.TEXT,
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    parent: {
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.TEXT
    }
  }, {
    classMethods: {
      associate: function(models){
        Post.belongsTo(models.User, {foreignKey: 'user_id'});
        Post.hasMany(models.Post, {
          as: 'Children',
          foreignKey: 'parent'
        });
      }
    },
    underscored: true,
    tableName: 'post',
    instanceMethods: {
      getParent: function(){
        return Post.find(this.parent);
      }
    }
  });

  return Post;
};


module.exports = PostSequelize;

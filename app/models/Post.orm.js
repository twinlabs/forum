var Sequelize = require('sequelize');

var PostSequelize = function(sequelize){
  var post = sequelize.define('post', {
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
        post.belongsTo(models.user, {foreignKey: 'user_id'});
        post.hasMany(models.post, {
          as: 'children',
          foreignKey: 'parent'
        });
      },

      countTopics: function() {
        return sequelize.query(
          'select count(*) from post where parent isnull'
        );
      }
    },
    underscored: true,
    tableName: 'post',
    instanceMethods: {
      getParent: function(){
        return post.find(this.parent);
      }
    }
  });

  return post;
};


module.exports = PostSequelize;

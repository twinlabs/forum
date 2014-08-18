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
    }
  }, {
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

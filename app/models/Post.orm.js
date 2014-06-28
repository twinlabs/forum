var Sequelize = require('sequelize');

var PostSequelize = function(sequelize){
  var Post = sequelize.define('Post', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    body: Sequelize.TEXT,
    user_id: Sequelize.INTEGER
  }, {
    underscored: true,
    tableName: 'post'
  });

  return Post;
};


module.exports = PostSequelize;

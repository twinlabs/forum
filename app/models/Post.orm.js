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
      },

      countPosts: function(topicID) {
        return sequelize.query(
            'select count(*) from ' +
              '(select "post".*, "User"."name" as "user.name", "User"."id" as "user.id" from' +
                 '"post" left outer join "forum_user" AS "User" ON "User"."id" = "post"."user_id" ' +
                 'where ("post"."parent" = \'' + topicID + '\' OR "post"."id" = \'' + topicID + '\')) as results'
        );
      },

      getLimitedPosts: function(topicID, limit) {
        limit = limit || 20;

        return sequelize.query(
          'select * from ' +
            '(select * from ' +
              '(select "post".*, "User"."name" as "user.name", "User"."id" as "user.id" from' +
                 '"post" left outer join "forum_user" AS "User" ON "User"."id" = "post"."user_id" ' +
                 'where ("post"."parent" = \'' + topicID + '\' OR "post"."id" = \'' + topicID + '\')' +
                 'ORDER BY "post".created_at ASC' +
              ') as subresults order by created_at desc limit ' + limit +
          ') as results order by created_at asc'
        );

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

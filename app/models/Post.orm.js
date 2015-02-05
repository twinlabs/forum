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

      countPosts: function(topicID) {
        return sequelize.query(
            'select count(*) from ' +
              '(select "post".*, "user"."name" as "user.name", "user"."id" as "user.id" from' +
                 '"post" left outer join "forum_user" AS "user" ON "user"."id" = "post"."user_id" ' +
                 'where ("post"."parent" = \'' + topicID + '\' OR "post"."id" = \'' + topicID + '\')) as results'
        );
      },

      getLimitedPosts: function(topicID, limit) {
        limit = limit || 20;

        return sequelize.query(
          'select * from ' +
            '(select * from ' +
              '(select "post".*, "user"."name" as "user.name", "user"."id" as "user.id", "user"."signature" as "user.signature" from' +
                 '"post" left outer join "forum_user" AS "user" ON "user"."id" = "post"."user_id" ' +
                 'where ("post"."parent" = \'' + topicID + '\' OR "post"."id" = \'' + topicID + '\')' +
                 'ORDER BY "post".created_at ASC' +
              ') as subresults order by created_at desc limit ' + limit +
          ') as results order by created_at asc'
        );

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

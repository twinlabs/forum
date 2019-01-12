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
    underscored: true,
    tableName: 'post'
  });


  post.associate = function(models){
    post.belongsTo(models.user, {foreignKey: 'user_id'});
    post.hasMany(models.post, {
      as: 'children',
      foreignKey: 'parent'
    });
  };

  post.findTopicsAndMetadata = function async () {
     return sequelize.query(
      `
        select
          title
          , id
          , (select count(id) from post
              where (parent=topic.id)
            ) as replyCount
          , (select id from post
            where (parent=topic.id)
            order by created_at desc limit 1
          ) as "lastreply.id"
          , coalesce(
            (select
              created_at from post where (parent=topic.id)
              order by created_at desc limit 1),
            created_at
            ) as "lastreply.created_at"
          , coalesce(
            (select name from forum_user
              where (
                id= (select user_id from post
                  where (parent=topic.id) order by created_at desc limit 1)
              )
              order by created_at desc limit 1
            ),
            (select name from forum_user where (id=topic.user_id))
            ) as "lastreply.user.name"
          , created_at
        from post as topic
        where (parent isnull)
        order by "lastreply.created_at" desc
      `,
      {
        nest: true,
        raw: true
      }
    )
  };

  post.findTopics = function() {
    return sequelize.query(
      `
        select
          title
          , id
          , (
              select created_at from post
              where (parent=topic.id)
              order by created_at desc limit 1
            ) as "lastreply.created_at"
          , created_at from post as topic
        where (parent isnull)
        order by "lastreply.created_at" desc
      `,
      {
        nest: true,
        raw: true
      }
    );
  };

  post.countTopics = function() {
    return sequelize.query(
      'select count(*) from post where parent isnull'
    );
  };

  post.findTopicTitle = function(topicID) {
    return sequelize.query('select title from post where id=' + topicID, {raw: true});
  };

  post.prototype.getParent = function(){
    return post.findOne(this.parent);
  };

  return post;
};


module.exports = PostSequelize;

var post = rootRequire('models/Post');
var user = rootRequire('models/User');
var Sequelize = require('sequelize');

var models = {post: post, user: user};

post.associate(models);
user.associate(models);

var PostsController = {
  edit: function(data){
    post.update({
      body: data.body
    },{
      where: {
        id: data.id
      }
    });
  },
  add: function(data, callback){
    post.create(data).then(callback);
  },

  destroy: function(data){
    post.destroy({
      where: {
        id: data.id
      }
    });
  },

  index: function(){
    return post.findAll({
      include: [user],
      order: [['created_at', 'ASC']]
    });
  },

  countTopics: function() {
    return post.countTopics();
  },

  findTopicTitle: function(topicID) {
    return post.findTopicTitle(topicID);
  },

  topics: function(limit){
    return post.findTopicsAndMetadata();
  },

  postsForTopic: function(lastVisited, topicID, limit, offset){
    var LAST_HOUR = 60* 60 * 0.5 * (1/24);
    limit = limit || 20;

    if (lastVisited >= (+new Date() - LAST_HOUR)) {
      return post.findAndCountAll({
        where: Sequelize.or(
          { parent: topicID },
          { id: topicID }
        ),
        include: [user],
        order: [['created_at', 'DESC']],
        limit: limit,
        offset: offset
      });
    }

    return post.count({
      where: Sequelize.and(
        {
          created_at: {
            gt: new Date(lastVisited)
          }
        },
        Sequelize.or(
          { parent: topicID },
          { id: topicID }
        )
      ),
      include: [user]
    }).then(function(countResult) {
      if (countResult < limit) {
        return post.findAndCountAll({
          where: Sequelize.or(
            { parent: topicID },
            { id: topicID }
          ),
          include: [user],
          order: [['created_at', 'DESC']],
          limit: limit,
          offset: offset
        });
      } else {
        return post.findAndCountAll({
          where: Sequelize.and(
            {
              created_at: {
                gt: new Date(lastVisited)
              }
            },
            Sequelize.or(
              { parent: topicID },
              { id: topicID }
            )
          ),
          include: [user],
          order: [['created_at', 'DESC']],
        });
      }
    });
  },

  postsForTopicAll: function(topicID) {
    return post.findAll({
      where: Sequelize.or(
        {parent: topicID},
        {id: topicID}
      ),
      include: [user],
      order: [['created_at', 'ASC']]
    });
  },

  get: function(id){
    return post.find({
      where: {
        id: id
      },
      include: [user]
    });
  },

  search: function(term, offset = 0) {
    return post.findAll({
      where: {
        $or: {
          body: {
            $iLike: `%${term}%`
          }
        }
      },
      include: [user],
      limit: 20,
      offset: offset,
      order: [['created_at', 'DESC']],
    });
  }
};

module.exports = PostsController;

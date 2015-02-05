var post = rootRequire('app/models/Post');
var user = rootRequire('app/models/User');
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
    post.create(data).done(callback);
  },

  destroy: function(data){
    post.destroy({
      id: data.id
    });
  },

  index: function(){
    return post.findAll({
      include: [user],
      order: 'created_at ASC'
    });
  },

  countTopics: function() {
    return post.countTopics();
  },

  topics: function(limit){
    // get posts without a parent.
    // consider these as 'topics'
    return post.findAll({
      where: ['"post"."parent" isnull'],
      include: [
        user,
        {
          model: post,
          as: 'children',
          include: [user]
        }
      ],
      order: [
        ['created_at', 'DESC'],
        [{model: post, as: 'children'}, 'created_at', 'DESC']
      ]
    });
  },

  countPostsForTopic: function(topicID) {
    return post.countPosts(topicID);
  },

  postsForTopic: function(topicID){
    return post.getLimitedPosts(topicID);
  },

  postsForTopicAll: function(topicID) {
    return post.findAll({
      where: Sequelize.or(
        {parent: topicID},
        {id: topicID}
      ),
      include: [user],
      order: 'created_at ASC'
    });
  },

  get: function(id){
    return post.find({
      where: {
        id: id
      },
      include: [user]
    });
  }
};

module.exports = PostsController;

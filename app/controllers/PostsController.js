var Post = rootRequire('app/models/Post');
var User = rootRequire('app/models/User');
var Sequelize = require('sequelize');

var models = {Post: Post, User: User};

Post.associate(models);
User.associate(models);

var PostsController = {
  edit: function(data){
    Post.update({
      body: data.body
    },{
      id: data.id
    });
  },
  add: function(data, callback){
    Post.create(data).done(callback);
  },

  destroy: function(data){
    Post.destroy({
      id: data.id
    });
  },

  index: function(){
    return Post.findAll({
      include: [User],
      order: 'created_at ASC'
    });
  },

  topics: function(){
    // get posts without a parent.
    // consider these as 'topics'
    return Post.findAll({
      where: ['"post"."parent" isnull'],
      include: [
        User,
        {
          model: Post,
          as: 'Children',
          include: [User]
        }
      ],
      order: [
        ['created_at', 'DESC'],
        [{model: Post, as: 'Children'}, 'created_at', 'DESC']
      ]
    });
  },

  postsForTopic: function(topicID){
    return Post.findAll({
      where: Sequelize.or(
        {parent: topicID},
        {id: topicID}
      ),
      include: [User],
      order: 'created_at ASC'
    });
  },

  get: function(id){
    return Post.find({
      where: {
        id: id
      },
      include: [User]
    });
  }
};

module.exports = PostsController;

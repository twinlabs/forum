var Post = rootRequire('app/models/Post');
var User = rootRequire('app/models/User');

var models = {Post: Post, User: User};

Post.associate(models);
User.associate(models);

var PostsController = {
  add: function(data){
    Post.create(data);
  },
  index: function(){
    return Post.findAll({
      include: [User],
      order: 'created_at ASC'
    });
  }
};

module.exports = PostsController;

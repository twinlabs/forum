var Post = rootRequire('app/models/Post');

var PostsController = {
  add: function(data){
    Post.create(data);
  },
  index: function(){
    return Post.findAll();
  }
};

module.exports = PostsController;

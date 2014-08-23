var assert = require('assert');

var Sequelize = require('sequelize');

var sequelize = new Sequelize("postgres://postgres@localhost/" + rootRequire('app').app.get('db-test'));

var Post = rootRequire('app/models/Post.orm')(sequelize);
var User = rootRequire('app/models/User.orm')(sequelize);

var models = {
  Post: Post,
  User: User
};

describe("database (user and post tables) stuff", function(){
  before(function(done){
    Post.sync({force: true}).success(function(){
      Post.associate(models);

      User.sync({force: true}).success(function(){
        User.associate(models);
        done();
      });
    });
  });

  it("works, basically", function(done){
    Post.create({
      body: "it's happening",
      user_id: 1
    }).success(function(post){
      assert(post.body === "it's happening");
      done();
    });
  });

  it('gets posts associated with a particular user', function(testDone){
    var user = User.build({
      name: 'Ty',
      id: 7
    });

    var userDeferred = user.save();

    var first_post = Post.build({
      id: 77,
      body: 'hello world. i am ty.',
      user_id: 7
    });

    var firstPostDeferred = first_post.save();

    var second_post = Post.build({
      id: 78,
      body: 'anyone want to post with me?',
      user_id: 7
    });

    var secondPostDeferred = second_post.save();

    userDeferred.done(function(){
      firstPostDeferred.done(function(error){
        if (error) {
          testDone();
          return console.log(error);
        }

        secondPostDeferred.done(function(error){
          if (error) {
            testDone();
            return console.log(error);
          }

          user.getPosts().done(function(error, data){
            if (error) {
              console.log(error);
            }

            assert(data.length === 2);
            testDone();
          });
        });
      });
    });
  });
});

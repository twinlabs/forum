var assert = require('assert');

var Sequelize = require('sequelize');

var sequelize = new Sequelize("postgres://postgres@localhost/forum");

var Post = rootRequire('app/models/Post.orm')(sequelize);
var User = rootRequire('app/models/User.orm')(sequelize);

var models = {
  Post: Post,
  User: User
};

Post.sync({force: true});
User.sync({force: true});


describe("orm post stuff", function(){
  // TODO: use a totally separate database for this stuff
  // and tear it down every time, just like in travis.
  it("works, basically", function(done){
    Post.create({
      body: "it's happening",
      user_id: 1
    }).success(function(post){
      assert(post.body === "it's happening");
      done();
    });
  });
});

describe("user-to-post association", function(){
  before(function(){
    Post.associate(models);
    User.associate(models);
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
      firstPostDeferred.done(function(){
        secondPostDeferred.done(function(){
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

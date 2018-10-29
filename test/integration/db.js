var assert = require('assert');

var Sequelize = require('sequelize');

var sequelize = new Sequelize("postgres://postgres@test_db/" + rootRequire('app').app.get('db-test'));

var post = rootRequire('models/Post.orm')(sequelize);
var user = rootRequire('models/User.orm')(sequelize);

var models = {
  post: post,
  user: user
};

describe("database (user and post tables) stuff", function(){
  before(function(done){
    post.sync({force: true}).success(function(){
      post.associate(models);

      user.sync({force: true}).success(function(){
        user.associate(models);
        done();
      });
    });
  });

  it("works, basically", function(done){
    post.create({
      body: "it's happening",
      user_id: 1
    }).success(function(post){
      assert(post.body === "it's happening");
      done();
    });
  });

  it('gets posts associated with a particular user', function(testDone){
    var userInstance = user.build({
      name: 'Ty',
      id: 7
    });

    var userDeferred = userInstance.save();

    var first_post = post.build({
      id: 77,
      body: 'hello world. i am ty.',
      user_id: 7
    });

    var firstPostDeferred = first_post.save();

    var second_post = post.build({
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

          userInstance.getPosts().done(function(error, data){
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

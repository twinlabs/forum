var assert = require('assert');

var Sequelize = require('sequelize');

var sequelize = new Sequelize("postgres://postgres@localhost/forum");

describe("orm post stuff", function(){
  it("works, basically", function(done){
    var Post = rootRequire('app/models/Post.orm')(sequelize);

    Post.create({
      body: "it's happening",
      user_id: 1
    }).success(function(post){
      assert(post.body === "it's happening");
      done();
    });
  });
});

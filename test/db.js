var assert = require('assert');

var Sequelize = require('sequelize');

var sequelize = new Sequelize("postgres://postgres@localhost/forum");

describe("orm post stuff", function(){
  // TODO: use a totally separate database for this stuff
  // and tear it down every time, just like in travis.
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

var assert = require('assert');

var Sequelize = require('sequelize');

var sequelize = new Sequelize("postgres://noah@localhost/forum");

describe("orm post stuff", function(){
  it("works, basically", function(done){
    var Post = sequelize.define('post', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      body: Sequelize.TEXT,
      user_id: Sequelize.INTEGER
    }, {
      underscored: true,
      tableName: 'post'
    });

    Post.create({
      body: "it's happening",
      user_id: 1
    }).success(function(post){
      assert(post.body === "it's happening");
      done();
    });
  });
});

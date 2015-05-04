var Sequelize = require('sequelize');

require('../lib/helpers');

var sequelize = new Sequelize("postgres://postgres@localhost/forum");

var Post = rootRequire('app/models/Post.orm')(sequelize);
var User = rootRequire('app/models/User.orm')(sequelize);

Post.sync({force:true}).then(function(){
  Post.create({
    body: "test post",
    user_id:1
  });
});

User.sync({force:true}).then(function(){
  User.create ({
    name: "Jason",
    id: 1
  });
});

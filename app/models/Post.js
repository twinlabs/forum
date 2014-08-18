var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL || "postgres://postgres@localhost/forum");

var Post = rootRequire('app/models/Post.orm')(sequelize);

module.exports = Post;

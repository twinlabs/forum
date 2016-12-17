var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL || "postgres://postgres@localhost/forum");

var Post = rootRequire('models/Post.orm')(sequelize);

module.exports = Post;

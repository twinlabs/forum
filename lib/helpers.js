var path = require('path');
var rootDir = __dirname + '/../';

module.exports = {
  getPostDate: function(post){
    if (post.children && post.children.length > 1) {
      return post.children[0].created_at;
    }

    return post.created_at;
  },
  isSupporter: function(user) {
    if (!user.is_supporter) {
      return {
        text: 'Donate',
        since: 'Donate Today!'
      };
    }

    return {
      text: 'Thank U',
      since: `Supporter Since ${user.is_supporter}`
    };
  },
  rootRequire: function(modulePath){ return require(rootDir + modulePath); },
  rootDir: path.resolve(rootDir)
};

global.rootRequire = module.exports.rootRequire;
global.rootDir = module.exports.rootDir;

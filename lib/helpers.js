var path = require('path');
var rootDir = __dirname + '/../';

module.exports = {
  isSupporter: function(user) {
    if (!user.is_supporter) {
      return {
        text: 'Donate Today!',
        action: 'https://www.paypal.com/cgi-bin/webscr'
      };
    }

    return {
      text: `Supporter Since ${moment(user.is_supporter).format('LL')}`,
      action: ''
    };
  },
  rootRequire: function(modulePath){ return require(rootDir + modulePath); },
  rootDir: path.resolve(rootDir)
};

global.rootRequire = module.exports.rootRequire;
global.rootDir = module.exports.rootDir;

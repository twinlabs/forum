var moment = require('moment');
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
  rootDir: path.resolve(rootDir),
  getMarkdownFileType: function(input) {
    var extension = path.extname(input);

    if (!extension) {
      return input;
    }

   if ((/\.(gif|jpg|jpeg|tiff|png)$/i).test(extension)) {
     return `![](${input})`;
   }

   if ((/\.(mp4|mov|webm|mkv|3gp)$/i).test(extension)) {
      return `<video src="${input}" controls />`;
   }

   if ((/\.(mp3|m4a|aac|ogg|flac)$/i).test(extension)) {
     return `<audio src="${input}" controls />`;
   }

   return input;
  }
};

global.rootRequire = module.exports.rootRequire;
global.rootDir = module.exports.rootDir;

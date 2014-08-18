var path = require('path');
var rootDir = __dirname + '/../';

module.exports = {
  rootRequire: function(modulePath){ return require(rootDir + modulePath); },
  rootDir: path.resolve(rootDir)
};

global.rootRequire = module.exports.rootRequire;
global.rootDir = module.exports.rootDir;

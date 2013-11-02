var rootDir = __dirname;

module.exports = global.rootRequire = function(modulePath){
  return require(rootDir + modulePath);
};

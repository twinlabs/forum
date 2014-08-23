var argv = require('optimist').argv;

module.exports = function(app){
  app.configure(function(){
    app.set('hostName', 'http://localhost');
    app.set('PORT', argv.port || 3000);
    app.set('db-test', 'forum_test');
  });

  app.configure('development', function(){
    // dev environment-specific stuff here:
  });
};

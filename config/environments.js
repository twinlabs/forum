module.exports = function(app){
  app.configure(function(){
    app.set('hostName', 'http://localhost');
    app.set('PORT', process.env.PORT || 3000);
    app.set('db-test', 'forum_test');
  });

  app.configure('development', function(){
    // dev environment-specific stuff here:
  });

  app.configure('test', function(){
    // test environment-specific stuff here:
  });


  app.configure('production', function(){
    app.set('hostName', 'http://ahfr-forum.herokuapp.com');
    // 'production' environment-specific stuff here:
  });
};

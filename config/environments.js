module.exports = function(app){
  app.configure(function(){
    app.set('hostName', 'http://localhost');
    app.set('PORT', process.env.PORT || 3000);
    app.set('db-test', 'forum_test');
    app.set('signupToken', 'c4d256875135311a8da112a57da39d7d');
  });

  app.configure('development', function(){
    // dev environment-specific stuff here:
  });

  app.configure('test', function(){
    // test environment-specific stuff here:
    app.set('PORT', process.env.PORT || 3099);
  });


  app.configure('production', function(){
    var environment = rootRequire('config/environments/production');

    app.set('hostName', environment.hostName);
    app.set('sessionSecret', environment.sessionSecret);
    app.set('signupToken', environment.signupToken);
  });
};

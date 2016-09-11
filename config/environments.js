module.exports = function(app){
  app.set('hostName', 'http://localhost');
  app.set('PORT', process.env.PORT || 3000);
  app.set('db-test', 'forum_test');
  app.set('signupToken', 'e4baa79988b55b8f73affa415a0a7163');


  if (process.env.NODE_ENV === 'test') {
    // test environment-specific stuff here:
    app.set('PORT', process.env.PORT || 3099);
  }


  if (process.env.NODE_ENV === 'production') {
    // production environment-specific stuff here:
    var environment = rootRequire('config/environments/production');

    app.set('hostName', environment.hostName);
    app.set('sessionSecret', environment.sessionSecret);
    app.set('signupToken', environment.signupToken);
  }
};

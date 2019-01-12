module.exports = function(app){
  app.set('hostName', 'http://localhost');
  app.set('PORT', process.env.PORT || 3000);
  app.set('db-test', 'forum_test');
  app.set('signupToken', '4f84a8faebe285025181023b2247a51b');


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

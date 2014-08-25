var User = rootRequire('app/models/User');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use('local-signup', new LocalStrategy({
  // by default, local strategy uses username and password.
  // override 'username' with 'email':
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(request, email, password, done){
  var user = User.create({name: request.query.name, email: email}).success(function(user){
    return done(null, user);
  });
}));

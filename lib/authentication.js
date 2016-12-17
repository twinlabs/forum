var User = rootRequire('models/User');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var bcrypt = require('bcrypt');
var crypto = require('crypto');

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
  bcrypt.genSalt(10, function(error, salt){
    bcrypt.hash(password, salt, function(hashError, hashedPassword){
      User.create({
        name: request.body.name,
        email: email,
        password: hashedPassword
      }).success(function(user){
        return done(null, user);
      });
    });
  });
}));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(request, email, password, done) {
  User.find({
    where: {
      email: email
    }
  }).success(function(user) {
    if (!user) {
      return done(null, false, { message: 'Incorrect email address.' });
    }

    user.isValidPassword(password, function(error, passwordStatus){
      if (passwordStatus !== true) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    });
  });
}));

function getMD5Hex(file) {
  if (typeof file !== "undefined") {
    var tokenHmac = crypto.createHmac('md5', file);

    return tokenHmac.digest('hex');
  }

  return "file not found";
}

function validateSignupToken(file) {
  return getMD5Hex(file.toString()) === rootRequire('app').app.get('signupToken');
}

module.exports = {
  getMD5Hex: getMD5Hex,
  validateSignupToken: validateSignupToken
};

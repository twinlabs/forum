require('./lib/helpers');

var express = require('express');
var http = require('http');
var app = express();
var session = require('express-session');
var lessMiddleware = require('less-middleware');
var httpServer = http.createServer(app);
var passport = require('passport');

rootRequire('config/environments')(app);
app.set('io', require('socket.io').listen(httpServer));

rootRequire('lib/authentication');
app.use(passport.initialize());
app.use(passport.session());

app.use(express.bodyParser());

rootRequire('config/routes')(app, passport);

var clientConstants = {
    socketAddress: app.get('hostName')
};

app.locals.clientConstants = JSON.stringify(clientConstants);

app.engine('jade', require('jade').__express);
app.set('views', process.cwd() + '/app/views');
app.set('view engine', 'jade');
app.use('/templates/post', express.static(__dirname + '/app/views/posts/'));

app.use(lessMiddleware({
  src: __dirname + '/app/assets'
  //, compress: true
}));

app.use(express.static(__dirname + '/app/assets'));

module.exports = {
  server: httpServer.listen(app.get('PORT'), function(){
    console.log('listening on port ' + app.get('PORT'));
  }),
  io: app.get('io'),
  app: app,
  port: app.get('PORT')
};

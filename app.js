require('./lib/helpers');

var express = require('express');
var app = express();
var lessMiddleware = require('less-middleware');


rootRequire('config/environments')(app);
app.set('io', require('socket.io').listen(app.get('SOCKET_PORT')));

rootRequire('config/routes')(app);

var clientConstants = {
    socketAddress: app.get('hostName') + ':' + app.get('SOCKET_PORT')
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
  server: app.listen(app.get('PORT')),
  io: app.get('io'),
  express: app,
  port: app.get('PORT'),
  socket_port: app.get('SOCKET_PORT')
};

console.log('listening on port ' + app.get('PORT'));

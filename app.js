var express = require('express');
var app = express();
var argv = require('optimist').argv;
var lessMiddleware = require('less-middleware');
var moment = require('moment');

var SOCKET_PORT = argv.socket_port || 5000;
var io = require('socket.io').listen(SOCKET_PORT);

io.sockets.on('connection', function(socket){
  socket.on('post', function(data){
    io.sockets.emit('post', data);
  });
});


var PORT = argv.port || 3000;

var clientConstants = {
    socketAddress: 'http://localhost:' + SOCKET_PORT
};
app.locals.clientConstants = JSON.stringify(clientConstants);

app.engine('jade', require('jade').__express);
app.set('views', process.cwd() + '/app/views');
app.set('view engine', 'jade');

app.use(lessMiddleware({
  src: __dirname + '/app/assets'
  //, compress: true
}));

app.use(express.static(__dirname + '/app/assets'));

app.get('/', function(request, response){
  response.render('index');
});

app.get('/uisandbox', function(request, response){
  response.render('posts/show');
});


var server = app.listen(PORT);
console.log('listening on port ' + PORT);

module.exports = {
  server: server,
  io: io,
  express: app,
  port: PORT,
  socket_port: SOCKET_PORT
};

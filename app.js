var express = require('express');
var app = express();
var io = require('socket.io').listen(5000);
var argv = require('optimist').argv;

io.sockets.on('connection', function(socket){
  socket.on('post', function(data){
    io.sockets.emit('post', data);
  });
});


var PORT = argv.port || 3000;

var clientConstants = {
    socketAddress: 'http://localhost:5000'
};
app.locals.clientConstants = JSON.stringify(clientConstants);

app.engine('jade', require('jade').__express);
app.set('views', process.cwd() + '/app/views');
app.set('view engine', 'jade');

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
  port: PORT
};

var express = require('express');
var app = express();
var argv = require('optimist').argv;
var lessMiddleware = require('less-middleware');
var moment = require('moment');

var SOCKET_PORT = argv.socket_port || 5000;
var io = require('socket.io').listen(SOCKET_PORT);

require('./config/environments')(app);
require('./lib/helpers');

var PostsController = require('./app/controllers/PostsController');

io.sockets.on('connection', function(socket){
  socket.on('post', function(data){

    PostsController.add(data);
    io.sockets.emit('post', data);
  });
});


var PORT = argv.port || 3000;

var clientConstants = {
    socketAddress: app.get('hostName') + ':' + SOCKET_PORT
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
  PostsController.index().done(function(error, posts){
    response.render('index', {
      posts: posts
    });
  });
});

app.get('/uisandbox', function(request, response){
  response.render('posts/show', {
    posts: [
      {
        id: 'post_1',
        date: moment('Wed Dec 25 2013 7:13:52 GMT-0500 (EST)').fromNow(),
        user: 'Willis',
        body: "There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, 'Oh dear! Oh dear! I shall be late!' (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge."
      },
      {
        id: 'post_2',
        date: moment('Wed Dec 25 2013 9:13:52 GMT-0500 (EST)').fromNow(),
        user: 'David',
        body: "So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her."

      },
      {
        id: 'post_3',
        date: moment('Wed Dec 25 2013 10:13:52 GMT-0500 (EST)').fromNow(),
        user: 'Alice',
        body: "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversation?<br/><img src=\"http://m.ahfr.org/content/cover3.gif\"/>"
      }
    ]
  });
});

app.use('/templates/post', express.static(__dirname + '/app/views/posts/'));

app.locals({
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

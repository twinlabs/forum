var assert = require('assert');
var sinon = require('sinon');
var app = require('../app');
var io = require('socket.io-client');
var http = require('http');

var socketAddress = 'http://localhost:5000';
app.io.set('log level', 1);

var options = {
  transports: ['websocket'],
  'force new connection': true
};


describe('app.js', function(){
  xit('accepts port as the first command-line argument', function(){
    sinon.spy(console, 'log');
    assert.ok(console.log.calledWith('listening on port 3000'));
  });
});


describe('assets', function(){
  it('uses middleware to serve LESS assets as CSS', function(done){
    var request = http.request({
      path: '/stylesheets/normalize.css',
      port: app.port
    }, function(response){
      assert(response.statusCode === 200, "status code not 200/OK");
      done();
    });

    request.end();

    request.on('error', function(error){
      console.log('request error: ' + error.message);
    });
  });
});

describe('rendering', function(){
  it('looks for views in the "app/views" subdirectory', function(){
    assert(app.express.get('views') === rootDir + '/app/views', "this instance of express has a different 'views' default than expected.");
  });

  it('registers jade as a templating engine', function(){
    assert(app.express.engines['.jade'], "jade is not registered with this instance of express.");
  });

  it('registers jade the default templating engine', function(){
    assert(app.express.get('view engine') === 'jade', "jade is not the default view engine for this instance of express.");
  });
});

describe('socket communication', function(){
  // this all requires server to be running. seems like an integration test suite.

  // set up a new event handler for our test event:
  app.io.sockets.on('connection', function(socket){
    socket.on('testEvent', function(data){
      app.io.sockets.emit(data.message, data);
    });
  });

  it('Should broadcast messages', function(done){
    var client = io.connect(socketAddress, options);
    var testData = {message: 'ping'};

    client.on('connect', function(data){

      client.emit('testEvent', testData);

      // TODO: can we remove this event in teardown?
      client.once('ping', function(receivedData){
        assert(receivedData.message === testData.message);
        done();
      });
    });
  });

  it('Should respond to "post" events', function(done){
    var client = io.connect(socketAddress, options);
    var testData = {message: "hello world"};

    client.once('post', function(){
      assert(true);
      done();
    });

    client.emit('post', testData);
  });

  after(function(){
    app.io.server.close();
  });
});

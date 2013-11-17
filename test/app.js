var assert = require('assert');
var sinon = require('sinon');
var app = require('../app');
var io = require('socket.io-client');

var socketURL = 'http://localhost:5000';
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


describe('socket communication', function(){
  // this all requires server to be running. seems like an integration test:
  it('Should broadcast messages', function(done){
    var client1 = io.connect(socketURL, options);
    var testData = {message: 'ping'};

    client1.on('connect', function(data){

      client1.emit('customEvent', testData);

      // TODO: can we remove this event in teardown?
      client1.once('ping', function(receivedData){
        assert(receivedData.message === testData.message);
        done();
      });
    });
  });

  after(function(){
    app.io.server.close();
  });
});

var assert = require('assert');
var sinon = require('sinon');
var app = require('./app');

describe('app.js', function(){
  xit('accepts port as the first command-line argument', function(){
    sinon.spy(console, 'log');
    assert.ok(console.log.calledWith('listening on port 3000'));
  });
});

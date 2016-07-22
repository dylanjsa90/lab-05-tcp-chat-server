'use strict';
const net = require('net');
const expect = require('chai').expect;

const server = require('../server');
const port = 5000;

describe('chat server', function() {
  before(function(done) {
    server.listen(port, done);
  });

  after(function(done) {
    server.close(done);
  });

  it('should send data between clients', function(done) {
    let client1 = net.connect({port});
    let client2 = net.connect({port});
    var messages = ['test message 2', 'test message 1', 'welcome to the server\n'];
    var toSend = ['test message 2', 'test message 1'];

    client2.on('data', function(data) {
      expect(data.toString()).to.include(messages.pop());
      if (toSend.length) {
        client1.write(toSend.pop());
      } else {
        client1.end();
      }
    });

    client1.on('close', function() {
      client2.end();
      expect(messages.length).to.eql(0);
      done();
    });
  });
});

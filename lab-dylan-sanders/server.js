'use strict';

const net = require('net');
const ClientPool = require('./lib/clientPool');
let clientPool = new ClientPool();

let server = net.createServer();

server.on('connection', function(socket) {
  clientPool.ee.emit('register', socket);
});

server.listen(3000, function() {
  console.log('server up');
});

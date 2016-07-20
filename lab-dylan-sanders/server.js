'use strict';

const net = require('net');
const ClientPool = require('./lib/clientPool');
let clientPool = new ClientPool();

let server = net.createServer();

server.on('connection', (socket) => {
  clientPool.ee.emit('register', socket);
});

server.listen(5000, () => {
  console.log('server up');
});

module.exports = server;

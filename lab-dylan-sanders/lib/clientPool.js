'use strict';
const EventEmitter = require('events').EventEmitter;

function register(clientPool, socket) {
  socket.userSocket = {};
  socket.userSocket.nickname  = 'user_' + (Math.floor(Math.random() * (200000 - 10000)) + 10000);
  socket.userSocket.id = (Math.floor(Math.random() * (10000 - 100)) + 100);
  socket.write('welcome to the server\n');

  socket.on('data', (data) => {
    if (data.toString() === 'END\r\n') {
      socket.write('disconnected');
      clientPool.ee.emit('close', socket, data);
      socket.emit('close');
    } else {
      clientPool.ee.emit('broadcast', socket, data);
    }

  });

  socket.on('error', (err) => {
    console.log('error:' + err.message);
  });

  socket.on('close', () => {
    clientPool.ee.emit('close', socket);
  });
  clientPool.pool[socket.userSocket.id] = socket;
}

let ClientPool = module.exports = exports = function() {
  this.pool = {};
  this.ee = new EventEmitter();

  this.ee.on('register', (socket) => {
    register(this, socket);
    Object.keys(this.pool).forEach((client) => {
      if(socket.userSocket.id !== client) {
        this.pool[client].write(socket.userSocket.nickname + ': has connected to server\n');
      } else {
        socket.write('welcome to the server\n');
      }
    });
  });

  this.ee.on('error', (error) => {
    console.log(error);
  });

  this.ee.on('close', (socket) => {
    socket.end();
    delete this.pool[socket.userSocket.id];
    console.log('disconnected from server');
  });

  this.ee.on('broadcast', (socket, data) => {
    let msg = data.toString();
    Object.keys(this.pool).forEach((client)  => {
      if (socket.userSocket.id !== client) this.pool[client].write(socket.userSocket.nickname + ': ' + msg);
    });
  });
};


module.exports = ClientPool;

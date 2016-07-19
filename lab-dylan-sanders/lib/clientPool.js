const EventEmitter = require('events');
var EE = new EventEmitter();

function ClientPool() {
  this.pool = {};
  this.ee = EE;

  this.ee.on('register', function(socket) {
    socket.id = (Math.floor(Math.random() * (10000 - 100)) + 100);
    socket.user  = 'user_' + (Math.floor(Math.random() * (200000 - 10000)) + 10000);
    this.pool[socket.id] = socket;
    socket.write('welcome to the server\n');

    this.ee.on('data', function(data) {
      this.ee.emit('broadcast', data);
    });


    this.ee.on('error', function(error) {
      console.log(error);
    });

    this.ee.on('close', function() {
      delete ClientPool.pool[this.id];
      this.end();
      console.log('disconnected from server');

    });

    this.ee.on('broadcast', function(msg) {
      if (msg.toString() === 'END\r\n') {
        this.ee.emit('close');
      }
      for (var s in ClientPool.pool) {
        if (this !== s) {
          s.write(s.user + ': ' + msg.toString());
        }
      }
    });

  }.bind(this));

}

module.exports = ClientPool;

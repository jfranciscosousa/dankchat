var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var autolinker = require('autolinker');
var _ = require('underscore');

app.use(express.static(__dirname + '/public'));

var users = [];

io.on('connection', function(socket) {
  socket.on('add user', function(msg) {
    socket.username = msg;
    //if the user exists (binary search)
    if (_.indexOf(users, msg, true) == -1) {
      //determine the sorted index (mantain the array sorted)
      var index = _.sortedIndex(users, msg);
      //insert the element at the index
      users.splice(index, 0, msg);
      console.log(users);
      var numUsers = _.size(users);
      socket.broadcast.emit('user joined', {
        username: msg,
        numUsers: numUsers
      });
      socket.emit('login', {
        numUsers: numUsers
      });
    } else {
      socket.emit('login-fail');
    }
  });

  socket.on('disconnect', function() {
    if (socket.username) {
      var index = _.indexOf(users, socket.username);
      users.splice(index, 1);
      console.log(users);
    }
  });

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function(data) {
    console.log(socket.username + ": " + data);
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });
});

http.listen(80, function() {
  console.log('listening on *:80');
});

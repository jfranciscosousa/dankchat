var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var autolinker = require('autolinker');
var _ = require('underscore');
var compress = require('compression');


app.use(compress());
app.use(express.static(__dirname + '/public'));

var htmlRegExp = new RegExp('</?\w+((\s+\w+(\s*=\s*(?:\".*?\"|\'.*?\' | [ ^ \'\">\s]+))?)+\s*|\s*)/?>');
var users = [];

io.on('connection', function(socket) {

  socket.on('add user', function(msg) {
    socket.username = msg;
    //if the user is not logged in (binary search)
    if (_.indexOf(users, msg, true) == -1) {
      //determine the sorted index (mantain the array sorted)
      var index = _.sortedIndex(users, msg);
      //insert the element at the index
      users.splice(index, 0, msg);
      console.log(users);
      var numUsers = _.size(users);
      //tell the clients a new user joined
      socket.broadcast.emit('user joined', {
        username: msg,
        numUsers: numUsers
      });
      //tel the user he successfully logged in
      socket.emit('login', {
        numUsers: numUsers,
        loggedUsers: users
      });
    }
    // if the username is already in use
    else {
      //tel the client that the login failed
      socket.emit('login-fail');
    }
  });

  //on disconnect event
  socket.on('disconnect', function() {
    //if the disconnect event is sent by an actual user
    if (socket.username) {
      var index = _.indexOf(users, socket.username);
      users.splice(index, 1);
      console.log(users);
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: _.size(users)
      });
    }
  });

  //on new message event
  socket.on('new message', function(data) {
    //test the message for markup

    if (/<[a-z][\s\S]*>/i.test(data)) {
      console.log("markup detected, ignored the message");
    } else {
      autolinker.link(data, {
        className: "myLink"
      });
      //log the message
      console.log(socket.username + ": " + data);
      //broadcast the message to other users
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: data
      });
    }
  });

  socket.on('typing', function(data) {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
    console.log(socket.username + 'is typing');
  });
});

http.listen(80, function() {
  console.log('listening on *:80');
});

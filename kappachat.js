var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var autolinker = require('autolinker');
var _ = require('underscore');
var compress = require('compression');
var low = require('lowdb');
var crypto = require('crypto');

var cipher = crypto.createCipher('aes-256-cbc', 'salt');
var password, algorithm = 'aes-256-ctr';

fs.readFile('key', 'utf8', function(err, data) {
  if (err) {
    //rip in pepperonis
    return console.log(err);
  }
  console.log("loaded encryption key");
  password = data;
});

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

//function returns true if auth is successfully
//also register the user if he does not exist (likely to change)
function auth(username, password) {
  if (password.length < 6)
    return false;
  password = encrypt(password);
  var db = low('db.json');
  var info = db('users').find({
    username: username
  });
  if (info)
    return info.password == password;
  else {
    var encryptedPassword = cipher.final('base64');
    db('users').push({
      username: username,
      password: password
    });
    return true;
  }
}

app.use(compress());
app.use(express.static(__dirname + '/public'));

var loggedUsers = [];

io.on('connection', function(socket) {

  socket.on('auth user', function(data) {
    socket.username = data.username;
    //if the user is not logged in (binary search)
    if (_.indexOf(loggedUsers, data.username, true) == -1) {
      //authenticate user
      if (auth(data.username, data.password)) {
        //determine the sorted index (mantain the array sorted)
        var index = _.sortedIndex(loggedUsers, data.username);
        //insert the element at the index
        loggedUsers.splice(index, 0, data.username);
        console.log(loggedUsers);
        var numUsers = _.size(loggedUsers);
        //tell the clients a new user joined
        socket.broadcast.emit('user joined', {
          username: socket.username,
          numUsers: numUsers
        });
        //tel the user he successfully logged in
        socket.emit('login', {
          numUsers: numUsers,
          loggedUsers: loggedUsers
        });
      } //wrong password
      else {
        socket.emit('login-fail');
      }
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
      var index = _.indexOf(loggedUsers, socket.username);
      loggedUsers.splice(index, 1);
      console.log(loggedUsers);
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: _.size(loggedUsers)
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
      //broadcast the message to other loggedUsers
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: data
      });
    }
  });
});

http.listen(80, function() {
  console.log('listening on *:80');
});

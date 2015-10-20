var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var autolinker = require('autolinker');
var _ = require('underscore');
var compress = require('compression');
var crypto = require('crypto');

// encryption
var key, algorithm = 'aes-256-ctr';

fs.readFile('key.txt', 'utf8', function(err, data) {
  if (err) {
    //rip in pepperonis
    return console.log(err);
  }
  console.log("loaded encryption key");
  key = data;
});

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, key)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

// database

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('users.db');

db.serialize(function() {
  db.run("CREATE TABLE  IF NOT EXISTS users (username TEXT, password TEXT)");
});

function addUser(username, password) {
  db.serialize(function() {
    var stmt = db.prepare("INSERT INTO users VALUES (?,?)");
    stmt.run(username, password);
    stmt.finalize();

  });
}

function getUserInfo(username) {
  db.serialize(function() {

    db.each("SELECT password from users where username=" + username, function(err, row) {
      if (row) {
        return row.password;
      } else {
        return null;
      }
    });
  });
}

//function returns true if auth is successfully
//also register the user if he does not exist (likely to change)
function auth(username, password) {
  if (password.length < 6)
    return false;
  password = encrypt(password);
  var info = getUserInfo(username);
  if (info)
    return info.password == password;
  else {
    addUser(username, password);
    return true;
  }
}

// web server

app.use(compress());
app.use(express.static(__dirname + '/public'));
http.listen(80, function() {
  console.log('listening on *:80');
});

// chatroom

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

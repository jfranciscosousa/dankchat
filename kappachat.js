var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var autolinker = require('autolinker');
var _ = require('underscore');
var compress = require('compression');
var crypto = require('crypto');

// web server

app.use(compress());
app.use("/",express.static(__dirname + '/public'));
http.listen(process.env.PORT || 8080, '0.0.0.0', function() {
  console.log('listening on *:8080');
});


// encryption
var key, algorithm = 'aes-256-ctr';

try {
  key = fs.readFileSync('dank.key', 'utf8').toString();
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
  //file doesnt exist - generate new key, save it to file
  key = crypto.randomBytes(128).toString();
  fs.writeFileSync('dank.key', key);
}

function encrypt(text, callback) {
  var cipher = crypto.createCipher(algorithm, key)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  callback(crypted);
}

// database

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('users.db');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS users (username TEXT UNIQUE, password TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS messages (date DATE DEFAULT (datetime('now','localtime')), username TEXT, message TEXT)");
});

function addUser(username, password) {
  db.serialize(function() {
    var stmt = db.prepare("INSERT INTO users VALUES (?,?)");
    stmt.run(username, password);
    stmt.finalize();
    console.log('new user ' + username);
  });
}

function getUserInfo(username, callback) {
  db.serialize(function() {
    var stmt = db.prepare("SELECT password from users where username=?"),
      res;
    stmt.all(username, function(err, rows) {
      if (rows[0]) {
        res = rows[0].password;
      } else {
        res = null;
      }
      callback(res);
    });
  });
}

function logMessage(username, message) {
  db.serialize(function() {
    var stmt = db.prepare("INSERT INTO messages (username,message) VALUES(?,?)");
    stmt.run(username, message);
  });
}

//function returns true if auth is successfully
//also register the user if he does not exist (likely to change)
function auth(username, password, callback) {
  var reason, res;
  if (password.length < 6) {
    reason = 'Password is too short!';
    res = false;
    callback(res, reason);
    return;
  }
  password = encrypt(password, function(password) {
    getUserInfo(username, function(info) {
      //if user is registered
      if (info) {
        //match password
        if (info == password) {
          reason = 'Password matches!'
          res = true;
        } else {
          res = false;
          reason = 'Wrong password!';
        }
      } else {
        addUser(username, password);
        reason = 'New user!';
        res = true;
      }
      callback(res, reason);
    });
  });
}
// chatroom

var loggedUsers = [];

io.on('connection', function(socket) {
  socket.on('auth user', function(data) {
    socket.username = data.username;
    //if the user is not logged in (binary search)
    if (_.indexOf(loggedUsers, data.username, true) == -1) {
      //authenticate user
      auth(data.username, data.password, function(authenticated, reason) {
        if (authenticated) {
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
          socket.emit('login-fail', {
            reason: reason
          });
        }
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
      logMessage(socket.username, data);
      console.log(socket.username + ": " + data);
      //broadcast the message to other loggedUsers
      socket.broadcast.emit('new message', {
        username: socket.username,
        message: data
      });
    }
  });
});

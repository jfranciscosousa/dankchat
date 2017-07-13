const express = require("express");
const app = express();
const path = require("path");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const autolinker = require("autolinker");
const _ = require("underscore");
const compress = require("compression");
const db = require("./data.js");

// web server

app.use(compress());
app.use(express.static(path.join(__dirname, "/../../public")));
http.listen(process.env.PORT || 8080, "0.0.0.0", function () {
  console.log("listening on *:8080");
});

app.get("/kappa", function (req, res) {
  res.redirect("https://twitchemotes.com/api_cache/v2/global.json");
});

//function returns true if auth is successfully
//also register the user if he does not exist (likely to change)
async function authenticate(username, password) {
  let response = {};
  if (password.length < 6) {
    response.reason = "Password is too short!";
    response.status = false;
    return response;
  }

  let user = await db.getUser(username)

  //if user is registered
  if (user) {
    //match password
    if (user.password == password) {
      response.reason = "Password matches!";
      response.status = true;
    } else {
      response.reason = false;
      response.status = "Wrong password!";
    }
  } else {
    await db.newUser(username, password);
    response.reason = "New user!";
    response.status = true;
  }
  return response;
}

// chatroom
var loggedUsers = [];

io.on("connection", function (socket) {

  //send a message through a socket
  function sendMessage(socket, username, message) {
    socket.emit("new message", {
      username: username,
      message: message
    });
  }

  socket.on("auth user", async function (data) {
    try {
      socket.username = data.username;
      //if the user is not logged in (binary search)
      if (_.indexOf(loggedUsers, data.username, true) == -1) {
        //authenticate user
        let auth = await authenticate(data.username, data.password);

        if (auth.status) {
          //determine the sorted index (mantain the array sorted)
          var index = _.sortedIndex(loggedUsers, data.username);
          //insert the element at the index
          loggedUsers.splice(index, 0, data.username);
          var numUsers = _.size(loggedUsers);

          //tell the clients a new user joined
          socket.broadcast.emit("user joined", {
            username: socket.username,
            numUsers: numUsers
          });

          //tell the user he successfully logged in
          socket.emit("login", {
            numUsers: numUsers,
            loggedUsers: loggedUsers
          });

          //give him past messages
          let messages = await db.getMessages();

          messages.forEach((message) => {
            sendMessage(socket, message.user_acc.username, message.message);
          });
        } //wrong password
        else {
          socket.emit("login-fail", {
            reason: auth.reason
          });
        }
      }
      // if the username is already in use
      else {
        //tel the client that the login failed
        socket.emit("login-fail");
      }
    } catch (error) {
      console.trace(error)
    }
  });

  //on disconnect event
  socket.on("disconnect", function () {
    //if the disconnect event is sent by an actual user
    if (socket.username) {
      var index = _.indexOf(loggedUsers, socket.username);
      loggedUsers.splice(index, 1);
      socket.broadcast.emit("user left", {
        username: socket.username,
        numUsers: _.size(loggedUsers)
      });
    }
  });

  //on new message event
  socket.on("new message", async function (data) {
    //test the message for markup
    if (/<[a-z][\s\S]*>/i.test(data)) {
      console.log("markup detected, ignored the message");
    } else {
      autolinker.link(data, {
        className: "myLink"
      });
      //log the message
      await db.newMessage(socket.username, data);
      console.log(socket.username + ": " + data);
      //broadcast the message to other loggedUsers
      await sendMessage(socket.broadcast, socket.username, data);
    }
  });
});

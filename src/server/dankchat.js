const express = require("express");

const app = express();
const path = require("path");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const autolinker = require("autolinker");
const compress = require("compression");
const db = require("./db/data.js");

// web server

app.use(compress());
app.use(express.static(path.join(__dirname, "/../../dist")));
app.use("/assets", express.static(path.join(__dirname, "/../../assets")));
http.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log("listening on *:8080");
});

app.get("/kappa", (req, res) => {
  res.redirect("https://twitchemotes.com/api_cache/v3/global.json");
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../../dist/index.html"));
});

// function returns true if auth is successfully
// also register the user if he does not exist (likely to change)
async function authenticate(username, password) {
  const response = {};
  if (password.length < 6) {
    response.reason = "Password is too short!";
    response.status = false;
    return response;
  }

  const user = await db.getUser(username);

  if (user) {
    if (user.password === password) {
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
const loggedUsers = new Set();

io.on("connection", socket => {
  socket.on("auth user", async data => {
    try {
      socket.username = data.username;

      if (isUserAlreadyLogged(data.username))
        return socket.emit("login-fail", { reason: "Already logged in" });

      const auth = await authenticate(data.username, data.password);

      if (auth.status) handleUserLogin(socket, data);
      else return socket.emit("login-fail", { reason: auth.reason });
    } catch (error) {
      console.trace(error);
    }
  });

  // on disconnect event
  socket.on("disconnect", () => {
    // if the disconnect event is sent by an actual user
    if (socket.username) {
      loggedUsers.delete(socket.username);

      socket.broadcast.emit("user left", {
        username: socket.username,
        numUsers: loggedUsers.size
      });
    }
  });

  // on new message event
  socket.on("new message", async data => {
    // test the message for markup
    if (/<[a-z][\s\S]*>/i.test(data)) {
      console.log("markup detected, ignored the message");
    } else {
      autolinker.link(data, {
        className: "myLink"
      });
      // log the message
      const message = await db.newMessage(socket.username, data);
      console.log(`${socket.username}: ${data}`);
      // broadcast the message to other loggedUsers
      sendMessage(socket.broadcast, message);

      socket.emit("message broadcasted", message);
    }
  });
});

function isUserAlreadyLogged(username) {
  return loggedUsers.has(username);
}

// send a message through a socket
function sendMessage(socket, message) {
  socket.emit("new message", message);
}

async function handleUserLogin(socket, userData) {
  loggedUsers.add(userData.username);

  // tell the clients a new user joined
  socket.broadcast.emit("user joined", {
    username: socket.username
  });

  const messages = await db.getMessages();

  // tell the user he successfully logged in
  socket.emit("login", {
    loggedUsers: Array.from(loggedUsers),
    messages
  });
}

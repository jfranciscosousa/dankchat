//send a message through a socket
exports.sendMessage = (socket, username, message) => {
  socket.emit("new message", {
    username: username,
    message: message
  });
};

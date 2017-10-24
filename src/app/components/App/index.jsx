import React from "react";

import Login from "../Login";
import Chat from "../Chat";
import socket from "../../socket";

import "./index.scss";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      component: () => <div />
    };

    if (getUserFromStorage() == null) this.state = { component: Login };

    socket.on("login", data => {
      this.setState({
        component: Chat,
        props: {
          messages: data.messages,
          users: new Set(data.loggedUsers)
        }
      });
    });
  }

  render() {
    return React.createElement(this.state.component, this.state.props || {});
  }
}

function getUserFromStorage() {
  let user = localStorage.getItem("user");

  if (user) {
    user = JSON.parse(user);

    socket.emit("auth user", {
      username: user.username,
      password: user.password
    });

    return user;
  }

  return null;
}

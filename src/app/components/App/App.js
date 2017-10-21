import React from "react";

import Login from "../Login/Login";
import Chat from "../Chat/Chat";
import socket from "../../socket";

import "./App.scss";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { component: () => { return <div></div>; } };

    if (getUserFromStorage() == null)
      this.state = { component: Login };

    this.logout = this.logout.bind(this);

    socket.on("login", (data) => {
      this.setState({
        component: Chat,
        props: {
          messages: data.messages,
          users: new Set(data.loggedUsers),
          logoutCallback: this.logout
        }
      });
    });
  }

  logout() {
    localStorage.removeItem("user");
    location.reload(true);
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

import React from "react";
import PropTypes from "prop-types";

import socket from "../../socket";

import "./Users.scss";

export default class Users extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: props.users
    };
  }

  componentWillMount() {
    socket.on("user joined", (data) => {
      this.setState((prevState) => {
        prevState.users.add(data.username);

        return { users: prevState.users };
      });
    });

    socket.on("user left", (data) => {
      this.setState((prevState) => {
        prevState.users.delete(data.username);

        return { users: prevState.users };
      });
    });
  }

  render() {
    return <ul className="Chat-users-list">
      {Array.from(this.state.users).map((user) => (
        <li className="Chat-users-element" key={user}>
          {user}
        </li>
      ))}
    </ul>;
  }
}

Users.propTypes = {
  users: PropTypes.instanceOf(Set)
};

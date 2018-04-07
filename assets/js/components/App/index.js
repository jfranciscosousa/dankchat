import React from "react";
import Chat from "../Chat";
import Login from "../Login";

export default class App extends React.Component {
  state = {
    token: null
  };

  onLogin = token => {
    this.setState({ token });
  };

  onLogout = () => {
    this.setState({ token: null });
  };

  render() {
    if (this.state.token) {
      return <Chat token={this.state.token} onLogout={this.onLogout} />;
    }

    return <Login onLogin={this.onLogin} />;
  }
}

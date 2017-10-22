import React from "react";

import socket from "../../socket";

import "./Login.scss";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      errorMessage: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    socket.on("login-fail", data => this.setState({ errorMessage: data.reason }));

    socket.on("login", () => {
      localStorage.setItem("user", JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }));
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  submit(event) {
    if (event.key === "Enter" && this.state.username != "") {
      socket.emit("auth user", {
        username: this.state.username.trim(),
        password: this.state.password
      });
    }
  }

  render() {
    return <form className="Login-page" onKeyPress={this.submit}>
            <h3 className="Login-page-label">DankName</h3>
            <input name="username" className="Login-page-input" type="text" maxLength="14" value={this.state.username} onChange={this.handleInputChange} />
            <h3 className="Login-page-label">DankPass</h3>
            <input name="password" type="password" className="Login-page-input" maxLength="14" value={this.state.password} onChange={this.handleInputChange} />
            <h3 className="Login-page-label">{this.state.errorMessage}</h3>
          </form>;
  }
}

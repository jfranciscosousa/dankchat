import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

export default class Login extends React.Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      errorMessage: ""
    };
  }

  handleInputChange = event => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value
    });
  };

  submit = async event => {
    const { onLogin } = this.props;
    const { username, password } = this.state;

    if (event.key === "Enter" && username !== "") {
      try {
        const response = await axios.post("/api/auth", {
          session: {
            username: username.trim(),
            password
          }
        });

        onLogin(response.data.token);
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    }
  };

  render() {
    const { username, password, errorMessage } = this.state;

    return (
      <form className="Login-page" role="presentation" onKeyPress={this.submit}>
        <h3 className="Login-page-label">DankName</h3>
        <input
          name="username"
          className="Login-page-input"
          type="text"
          maxLength="14"
          value={username}
          onChange={this.handleInputChange}
        />
        <h3 className="Login-page-label">DankPass</h3>
        <input
          name="password"
          type="password"
          className="Login-page-input"
          maxLength="14"
          value={password}
          onChange={this.handleInputChange}
        />
        <h3 className="Login-page-label">{errorMessage}</h3>
      </form>
    );
  }
}

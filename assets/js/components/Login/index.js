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

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value
    });
  }

  async submit(event) {
    if (event.key === "Enter" && this.state.username !== "") {
      try {
        const response = await axios.post("/api/auth", {
          session: {
            username: this.state.username.trim(),
            password: this.state.password
          }
        });

        this.props.onLogin(response.data.token);
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    }
  }

  render() {
    return (
      <form className="Login-page" role="presentation" onKeyPress={this.submit}>
        <h3 className="Login-page-label">DankName</h3>
        <input
          name="username"
          className="Login-page-input"
          type="text"
          maxLength="14"
          value={this.state.username}
          onChange={this.handleInputChange}
        />
        <h3 className="Login-page-label">DankPass</h3>
        <input
          name="password"
          type="password"
          className="Login-page-input"
          maxLength="14"
          value={this.state.password}
          onChange={this.handleInputChange}
        />
        <h3 className="Login-page-label">{this.state.errorMessage}</h3>
      </form>
    );
  }
}

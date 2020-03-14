import React, { useState } from "react";
import { useChatContext } from "root/hooks/useChannel";

export default function Login() {
  const { login } = useChatContext();
  const [state, setState] = useState({
    username: "",
    password: "",
    errorMessage: ""
  });
  const { username, password, errorMessage } = state;

  function handleInputChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    setState({
      ...state,
      [name]: value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (state.username !== "") {
      try {
        await login(username, password);
      } catch (error) {
        console.log(error); //eslint-disable-line
      }
    }
  }

  return (
    <form className="Login-page" onSubmit={handleSubmit}>
      <h3 className="Login-page-label">DankName</h3>
      <input
        name="username"
        className="Login-page-input"
        type="text"
        maxLength="14"
        value={username}
        onChange={handleInputChange}
      />
      <h3 className="Login-page-label">DankPass</h3>
      <input
        name="password"
        type="password"
        className="Login-page-input"
        maxLength="14"
        value={password}
        onChange={handleInputChange}
      />
      <h3 className="Login-page-label">{errorMessage}</h3>

      <button style={{ display: "none" }} type="submit">
        Submit
      </button>
    </form>
  );
}

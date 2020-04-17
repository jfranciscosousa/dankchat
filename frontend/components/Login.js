import React, { useState } from "react";
import { useChatContext } from "root/hooks/useChannel";
import styled from "@emotion/styled";
import rarepepe from "root/assets/rarepepe.jpg";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  background-color: #000;
  background-image: url("${rarepepe}");
  background-size: cover;
`;

const Label = styled.label`
  margin-top: 2rem;
  margin-bottom: 0.5rem;

  color: white;

  font-size: 2rem;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
`;

const Input = styled.input`
  width: 400px;

  padding-bottom: 15px;

  background-color: transparent;
  border: none;
  border-bottom: 2px solid #fff;

  color: white;

  font-size: 200%;
  letter-spacing: 3px;
  text-align: center;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
`;

const HiddenButton = styled.button`
  display: none;
`;

export default function Login() {
  const { login } = useChatContext();
  const [state, setState] = useState({
    username: "",
    password: "",
    errorMessage: "",
  });
  const { username, password, errorMessage } = state;

  function handleInputChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    setState({
      ...state,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (state.username !== "") {
      try {
        await login(username, password);
      } catch (error) {
        console.log(error); //eslint-disable-line
        setState({...state, errorMessage: "USER NOT FOUND MATE"})
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Label htmlFor="username">DankName</Label>
      <Input
        id="username"
        name="username"
        type="text"
        maxLength="14"
        value={username}
        onChange={handleInputChange}
      />
      <Label htmlFor="password">DankPass</Label>
      <Input
        id="password"
        name="password"
        type="password"
        maxLength="14"
        value={password}
        onChange={handleInputChange}
      />
      <Label>{errorMessage}</Label>
      <HiddenButton type="submit">Submit</HiddenButton>
    </Form>
  );
}

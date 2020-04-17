import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

const Input = styled.input`
  width: 100%;
  height: 100%;

  padding-left: 10px;

  border: 10px solid #000;
  outline: none;

  font-size: 75%;
`;

function InputMessage({ onSubmit }) {
  const [message, setMessage] = useState("");

  function handleInputChange(event) {
    setMessage(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    onSubmit(message);
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        autoComplete="false"
        name="message"
        value={message}
        onChange={handleInputChange}
        placeholder="Type here..."
      />
    </form>
  );
}

InputMessage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default InputMessage;

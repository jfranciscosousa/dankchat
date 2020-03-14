import React, { useState } from "react";
import PropTypes from "prop-types";

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
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        autoComplete="false"
        name="message"
        value={message}
        onChange={handleInputChange}
        className="Chat-inputMessage"
        placeholder="Type here..."
      />
    </form>
  );
}

InputMessage.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default InputMessage;

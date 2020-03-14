/* eslint-disable no-bitwise */

import React from "react";
import PropTypes from "prop-types";

function generateColor(username) {
  let hash = 0;

  for (let index = 0; index < username.length; index += 1) {
    hash = username.charCodeAt(index) + ((hash << 5) - hash);
  }
  let color = "#";

  for (let index = 0; index < 3; index += 1) {
    const value = (hash >> (index * 8)) & 0xff;

    color += `00${value.toString(16)}`.substr(-2);
  }

  return color;
}

function Message({ username, date, body }) {
  const formattedDate = new Date(date).toLocaleTimeString();

  return (
    <div>
      <span
        className="Chat-message-username"
        style={{ color: generateColor(username) }}
      >
        [{formattedDate}] : {username}
      </span>

      <span className="Chat-message-body">{body}</span>
    </div>
  );
}

Message.propTypes = {
  username: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired
};

export default Message;

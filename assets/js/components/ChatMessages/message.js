/* eslint-disable no-bitwise */

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

function Message({ username, date, body }) {
  function generateColor() {
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

  const formattedDate = moment()
    .utc(date)
    .toDate()
    .toLocaleTimeString();

  return (
    <div>
      <span
        className="Chat-message-username"
        style={{ color: generateColor() }}
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

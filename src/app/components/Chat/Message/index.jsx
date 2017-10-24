import React from "react";
import PropTypes from "prop-types";

import "./index.scss";

ChatMessage.propTypes = {
  message: PropTypes.object.isRequired,
  renderUser: PropTypes.bool.isRequired
};

export default function ChatMessage(props) {
  return (
    <li key={props.message.id}>
      <Username message={props.message} renderUser={props.renderUser} />
      <div className="Chat-message-body">{props.message.message}</div>
    </li>
  );
}

Username.propTypes = {
  message: PropTypes.object.isRequired,
  renderUser: PropTypes.bool.isRequired
};

function Username(props) {
  if (props.renderUser)
    return (
      <span
        className="Chat-message-username"
        style={{ color: getColor(props.message) }}
      >
        [{getShortDate(props.message.createdAt)}]{" "}
        {props.message.user_acc.username}
      </span>
    );
  return null;
}

function getColor(message) {
  const username = message.user_acc.username;
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  return color;
}

function getShortDate(date) {
  const options = {
    hour: "2-digit",
    minute: "2-digit"
  };

  return new Date(date).toLocaleTimeString("pt-PT", options);
}

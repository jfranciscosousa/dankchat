import React from "react";
import PropTypes from "prop-types";

function ChatUsers({ users }) {
  return (
    <div className="Chat-users-list">
      {Array.from(users).map(user => (
        <div className="Chat-users-element" key={user}>
          {user}
        </div>
      ))}
    </div>
  );
}

ChatUsers.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ChatUsers;

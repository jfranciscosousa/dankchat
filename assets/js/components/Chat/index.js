import React from "react";
import PropTypes from "prop-types";
import ChatMessages from "../ChatMessages";
import ChatUsers from "../ChatUsers";
import InputMessage from "../InputMessage";
import useChannels from "../../hooks/useChannels";

function Chat({ onLogout, token }) {
  const [users, messages, submitMessage] = useChannels(token);

  return (
    <div className="Chat">
      <div className="Chat-nav">
        <button className="Chat-nav-logout" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="Chat-area">
        <ChatMessages messages={messages} />

        <ChatUsers users={users} />
      </div>

      <InputMessage onSubmit={submitMessage} />
    </div>
  );
}

Chat.propTypes = {
  onLogout: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired
};

export default Chat;
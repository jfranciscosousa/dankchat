import React from "react";
import { useChatContext } from "root/hooks/useChannel";
import ChatMessages from "../ChatMessages";
import ChatUsers from "../ChatUsers";
import InputMessage from "../InputMessage";

function Chat() {
  const { users, messages, logout, submitMessage } = useChatContext();

  return (
    <div className="Chat">
      <div className="Chat-nav">
        <button className="Chat-nav-logout" type="button" onClick={logout}>
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

export default Chat;

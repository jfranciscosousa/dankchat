import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Message from "./message";

function ChatMessages({ messages }) {
  const chatAreaRef = useRef();

  useEffect(() => {
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="Chat-messages" ref={chatAreaRef}>
      {messages.map(message => (
        <Message
          key={message.id}
          username={message.user.username}
          date={message.inserted_at}
          body={message.body}
        />
      ))}
    </div>
  );
}

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        username: PropTypes.string.isRequired
      }).isRequired,
      body: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ChatMessages;

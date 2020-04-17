import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import ChatMessage from "./ChatMessage";

const MessageList = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;

  list-style: none;
`;

function ChatMessages({ messages }) {
  const chatAreaRef = useRef();

  useEffect(() => {
    chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
  }, [messages]);

  return (
    <MessageList ref={chatAreaRef}>
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          username={message.user.username}
          date={message.inserted_at}
          body={message.body}
        />
      ))}
    </MessageList>
  );
}

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
      }).isRequired,
      body: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ChatMessages;

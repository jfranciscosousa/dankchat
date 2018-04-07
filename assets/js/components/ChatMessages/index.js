import React, { Component } from "react";
import PropTypes from "prop-types";
import Message from "./message";

export default class ChatMessages extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        user: PropTypes.shape({
          username: PropTypes.string.isRequired
        }).isRequired,
        body: PropTypes.string.isRequired
      })
    )
  };

  componentDidMount() {
    this.chatArea.scrollTop = this.chatArea.scrollHeight;
  }

  componentDidUpdate() {
    this.chatArea.scrollTop = this.chatArea.scrollHeight;
  }

  render() {
    const { messages } = this.props;

    return (
      <div
        className="Chat-messages"
        ref={el => {
          this.chatArea = el;
        }}
      >
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
}

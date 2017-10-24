import React from "react";
import PropTypes from "prop-types";

import Message from "../Message";

import "./index.scss";

export default class Messages extends React.Component {
  static propTypes = {
    messages: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.chatMessagesEl.scrollTop = this.chatMessagesEl.scrollHeight;
  }

  componentDidUpdate() {
    this.chatMessagesEl.scrollTop = this.chatMessagesEl.scrollHeight;
  }

  render() {
    let previousUser;

    return (
      <ul className="Chat-messages" ref={el => (this.chatMessagesEl = el)}>
        {this.props.messages.map(message => {
          const renderUser = message.user_acc.username !== previousUser;
          previousUser = message.user_acc.username;

          return (
            <Message
              message={message}
              renderUser={renderUser}
              key={message.id}
            />
          );
        })}
      </ul>
    );
  }
}

import React from "react";
import PropTypes from "prop-types";

import socket from "../../socket";
import Users from "../Users";
import AudioNotification from "../AudioNotification";
import ChatMessage from "./Message";

import "./index.scss";

export default class Chat extends React.Component {
  static propTypes = {
    messages: PropTypes.array.isRequired,
    users: PropTypes.instanceOf(Set).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      messages: props.messages,
      inputMessage: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    socket.on("new message", message => {
      this.addMessage(message);
    });

    socket.on("message broadcasted", message => {
      this.addMessage(message);

      this.inputMessage = "";
    });
  }

  componentDidMount() {
    this.scrollDown();
  }

  componentDidUpdate() {
    this.scrollDown();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  submit(event) {
    if (event.key === "Enter" && this.state.inputMessage !== "") {
      socket.emit("new message", this.state.inputMessage);
      this.setState({ inputMessage: "" });
    }
  }

  addMessage(message) {
    this.audioNotification.playSound();

    this.setState({
      messages: this.state.messages.concat([message])
    });
  }

  scrollDown() {
    this.chatMessagesEl.scrollTop = this.chatMessagesEl.scrollHeight;
  }

  render() {
    let previousUser;

    return (
      <div id="chat" className="Chat-page">
        <div className="Chat-nav">
          <div
            className="Chat-nav-logout"
            onClick={logout}
            role="button"
            tabIndex={-1}
          >
            Logout
          </div>
        </div>

        <AudioNotification ref={el => (this.audioNotification = el)} />

        <div className="Chat-chatArea">
          <ul className="Chat-messages" ref={el => (this.chatMessagesEl = el)}>
            {this.state.messages.map(message => {
              const renderUser = message.user_acc.username !== previousUser;
              previousUser = message.user_acc.username;
              return (
                <ChatMessage
                  message={message}
                  renderUser={renderUser}
                  key={message.id}
                />
              );
            })}
          </ul>
          <Users users={this.props.users} className="Chat-users" />
        </div>

        <input
          name="inputMessage"
          onKeyPress={this.submit}
          value={this.state.inputMessage}
          onChange={this.handleInputChange}
          className="Chat-inputMessage"
          placeholder="Type here..."
        />
      </div>
    );
  }
}

function logout() {
  localStorage.removeItem("user");
  location.reload(true);
}

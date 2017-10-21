import React from "react";
import PropTypes from "prop-types";

import socket from "../../socket";
import Users from "../Users/Users";
import AudioNotification from "../AudioNotification/AudioNotification";
import ChatMessage from "../ChatMessage/ChatMessage";

import "./Chat.scss";

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: props.messages,
      inputMessage: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submit = this.submit.bind(this);
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
    if (event.key === "Enter" && this.state.inputMessage != "") {
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

  scrollDown(){
    this.chatMessagesEl.scrollTop = this.chatMessagesEl.scrollHeight;
  }

  componentWillMount() {
    socket.on("new message", (message) => {
      this.addMessage(message);
    });

    socket.on("message broadcasted", (message) => {
      this.addMessage(message);

      this.inputMessage = "";
    });
  }

  componentDidMount(){
    this.scrollDown();
  }

  componentDidUpdate() {
    this.scrollDown();
  }

  render() {
    return <div id="chat" className="Chat-page">
      <div className="Chat-nav">
        <a className="Chat-nav-logout" onClick={this.props.logoutCallback}>Logout</a>
      </div>

      <AudioNotification ref={(el) => this.audioNotification = el} />

      <div className="Chat-chatArea">
        <ul className="Chat-messages" ref={(el) => this.chatMessagesEl = el}>
          {this.state.messages.map((message) => (
            <ChatMessage message={message} key={message.id}/>
          ))}
        </ul>
        <Users users={this.props.users} className="Chat-users"></Users>
      </div>

      <input name="inputMessage" onKeyPress={this.submit} value={this.state.inputMessage} onChange={this.handleInputChange} className="Chat-inputMessage" placeholder="Type here..."/>
    </div >;
  }
}

Chat.propTypes = {
  messages: PropTypes.array.isRequired,
  users: PropTypes.instanceOf(Set).isRequired,
  logoutCallback: PropTypes.func.isRequired
};

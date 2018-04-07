import React from "react";
import PropTypes from "prop-types";
import withChannel from "../WithChannel";
import withAudioNotifier from "../WithAudioNotifier";
import ChatMessages from "../ChatMessages";
import ChatUsers from "../ChatUsers";
import InputMessage from "../InputMessage";

@withChannel
@withAudioNotifier
export default class Chat extends React.Component {
  static propTypes = {
    onLogout: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired, // withChannel
    playNotification: PropTypes.func.isRequired // withAudioNotifier
  };

  state = {
    messages: [],
    users: []
  };

  componentWillMount() {
    this.props.channel.on("new_msg", payload => {
      this.setState({
        messages: this.state.messages.concat([payload])
      });

      this.props.playNotification();
    });

    this.props.channel.on("lobby_update", payload => {
      this.setState({
        users: payload.users,
        messages: payload.messages
      });
    });
  }

  onSubmitMessage = message => {
    this.props.channel.push("new_msg", { body: message });
  };

  render() {
    return (
      <div className="Chat">
        <div className="Chat-nav">
          <button className="Chat-nav-logout" onClick={this.props.onLogout}>
            Logout
          </button>
        </div>

        <div className="Chat-area">
          <ChatMessages messages={this.state.messages} />

          <ChatUsers users={this.state.users} />
        </div>

        <InputMessage onSubmit={this.onSubmitMessage} />
      </div>
    );
  }
}

import React from "react";
import PropTypes from "prop-types";
import { Socket } from "phoenix";

export default Child =>
  class ChatChannel extends React.Component {
    static propTypes = {
      token: PropTypes.string.isRequired
    };

    constructor(props) {
      super(props);

      this.socket = new Socket("/socket", {
        params: { token: props.token }
      });
      this.socket.connect();

      this.channel = this.socket.channel("room:lobby", {});
      this.channel
        .join()
        .receive("ok", resp => {
          console.log("Joined successfully", resp); // eslint-disable-line
        })
        .receive("error", resp => {
          console.log("Unable to join", resp); // eslint-disable-line
        });
    }

    componentWillUnmount() {
      this.socket.disconnect();
    }

    render() {
      return <Child {...this.props} channel={this.channel} />;
    }
  };

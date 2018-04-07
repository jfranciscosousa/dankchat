import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

export default class Message extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired
  };

  /* eslint-disable no-bitwise */
  get color() {
    const { username } = this.props;

    let hash = 0;

    for (let index = 0; index < username.length; index += 1) {
      hash = username.charCodeAt(index) + ((hash << 5) - hash);
    }
    let color = "#";

    for (let index = 0; index < 3; index += 1) {
      const value = (hash >> (index * 8)) & 0xff;

      color += `00${value.toString(16)}`.substr(-2);
    }

    return color;
  }
  /* eslint-enable no-bitwise */

  get date() {
    return moment
      .utc(this.props.date)
      .toDate()
      .toLocaleTimeString();
  }

  render() {
    return (
      <div>
        <span className="Chat-message-username" style={{ color: this.color }}>
          [{this.date}] : {this.props.username}
        </span>

        <span className="Chat-message-body">{this.props.body}</span>
      </div>
    );
  }
}

import React from "react";
import PropTypes from "prop-types";

export default class Users extends React.Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  render() {
    return (
      <div className="Chat-users-list">
        {Array.from(this.props.users).map(user => (
          <div className="Chat-users-element" key={user}>
            {user}
          </div>
        ))}
      </div>
    );
  }
}

import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class InputMessage extends PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  state = {
    message: ""
  };

  handleInputChange = event => {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    event.stopPropagation();

    this.props.onSubmit(this.state.message);
    this.setState({ message: "" });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          autoFocus="true"
          autoComplete="false"
          name="message"
          value={this.state.message}
          onChange={this.handleInputChange}
          className="Chat-inputMessage"
          placeholder="Type here..."
        />
      </form>
    );
  }
}

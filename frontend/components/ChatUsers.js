import React from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";

const List = styled.ul`
  display: inline-block;
  padding: 0 1rem 1rem 1rem;
  margin: 0;

  border-left: 1px solid black;
  list-style-type: none;
`;

const ListItem = styled.li`
  width: 100%;
  margin-top: 1rem;

  border-bottom: 1px solid black;
`;

function ChatUsers({ users }) {
  return (
    <List>
      {Array.from(users).map((user) => (
        <ListItem key={user}>{user}</ListItem>
      ))}
    </List>
  );
}

ChatUsers.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ChatUsers;

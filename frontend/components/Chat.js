import React from "react";
import styled from "@emotion/styled";
import { useChatContext } from "root/hooks/useChannel";
import ChatMessages from "./ChatMessages";
import ChatUsers from "./ChatUsers";
import InputMessage from "./InputMessage";

const navHeight = "50px";
const inputHeight = "70px";
const areaHeight = `calc(100vh - ((${navHeight} + ${inputHeight})))`;

const Root = styled.div`
  display: grid;
  height: 100vh;
  grid-template-rows: ${navHeight} ${areaHeight} ${inputHeight};
  grid-auto-rows: 100%;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;

  background-color: black;
  color: white;
`;

const LogoutButton = styled.button`
  padding: 0;
  margin-top: auto;
  margin-right: 25px;
  margin-bottom: auto;

  background: none;
  border: none;
  color: inherit;

  cursor: pointer;
  outline: inherit;

  font: inherit;
`;

const ChatArea = styled.main`
  flex: 1;

  display: grid;
  grid-template-columns: 80% 20%;
`;

function Chat() {
  const { users, messages, logout, submitMessage } = useChatContext();

  return (
    <Root>
      <Nav>
        <LogoutButton type="button" onClick={logout}>
          Logout
        </LogoutButton>
      </Nav>

      <ChatArea>
        <ChatMessages messages={messages} />

        <ChatUsers users={users} />
      </ChatArea>

      <InputMessage onSubmit={submitMessage} />
    </Root>
  );
}

export default Chat;

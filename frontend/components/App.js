/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { Global, css } from "@emotion/core";
import { useChatContext, ChatProvider } from "root/hooks/useChannel";
import sound from "root/assets/notif.mp3";
import Chat from "./Chat";
import Login from "./Login";

const globalStyles = css`
  * {
    box-sizing: border-box;
  }

  body,
  html,
  #root {
    height: 100%;
    max-height: 100%;
    min-height: 100%;
    margin: 0;
  }

  html {
    padding: 0;
    margin: 0;

    font-size: 125%;
  }

  html,
  input {
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue",
      Helvetica, Arial, "Lucida Grande", sans-serif;
  }
`;

function InnerApp() {
  const { user } = useChatContext();


  return (
    <>
      <audio
        id="notif"
        src={sound}
        preload="auto"
        style={{ display: "none" }}
      />
      <Global styles={globalStyles} />
      {user ? <Chat /> : <Login />}
    </>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <InnerApp />
    </ChatProvider>
  );
}

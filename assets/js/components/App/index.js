/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { useChatContext, ChatProvider } from "root/hooks/useChannel";
import Chat from "../Chat";
import Login from "../Login";

import sound from "../../../static/sounds/notif.mp3";

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

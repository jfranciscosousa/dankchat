/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState } from "react";
import Chat from "../Chat";
import Login from "../Login";

import sound from "../../../static/sounds/notif.mp3";

export default function App() {
  const [token, setToken] = useState();

  function onLogin(newToken) {
    setToken(newToken);
  }

  function onLogout() {
    setToken(null);
  }

  return (
    <>
      <audio
        id="notif"
        src={sound}
        preload="auto"
        style={{ display: "none" }}
      />
      {token ? (
        <Chat token={token} onLogout={onLogout} />
      ) : (
        <Login onLogin={onLogin} />
      )}
    </>
  );
}

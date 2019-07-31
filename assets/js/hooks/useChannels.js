import { useMemo, useReducer } from "react";
import { Socket } from "phoenix";

let withoutFocus;

window.onfocus = () => {
  withoutFocus = false;
};

window.onblur = () => {
  withoutFocus = true;
};

function playAudio() {
  const notif = document.getElementById("notif");

  if (notif && withoutFocus) notif.play();
}

function buildChannel(token) {
  const socket = new Socket("/socket", {
    params: { token }
  });

  socket.connect();

  const channel = socket.channel("room:lobby", {});

  channel
    .join()
    .receive("ok", resp => {
      console.log("Joined successfully", resp); // eslint-disable-line
    })
    .receive("error", resp => {
      console.log("Unable to join", resp); // eslint-disable-line
    });

  return channel;
}

const INITIAL_STATE = {
  users: [],
  messages: []
};

function reducer(state, action) {
  switch (action.type) {
    case "new_msg":
      return { ...state, messages: [...state.messages, action.payload] };
    case "lobby_update":
      return action.payload;
    default:
      throw new Error("Unhandled action");
  }
}

export default function useChannels(token) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const channel = useMemo(() => {
    const newChannel = buildChannel(token);

    function handleNewMessage(message) {
      dispatch({ type: "new_msg", payload: message });
      playAudio();
    }

    function handleLobbyUpdate(lobby) {
      dispatch({ type: "lobby_update", payload: lobby });
    }

    newChannel.on("new_msg", handleNewMessage);

    newChannel.on("lobby_update", handleLobbyUpdate);

    return newChannel;
  }, [token]);

  function submitMessage(message) {
    channel.push("new_msg", { body: message });
  }

  return [state.users, state.messages, submitMessage];
}

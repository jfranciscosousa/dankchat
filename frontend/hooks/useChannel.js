import React, {
  useMemo,
  useReducer,
  createContext,
  useContext,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";
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
    params: { token },
  });

  socket.connect();

  const channel = socket.channel("room:lobby", {});

  channel
    .join()
    .receive("ok", (resp) => {
      console.log("Joined successfully", resp); // eslint-disable-line
    })
    .receive("error", (resp) => {
      console.log("Unable to join", resp); // eslint-disable-line
    });

  return channel;
}

function getUserFromStorage() {
  return sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;
}

const INITIAL_STATE = {
  users: [],
  messages: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload };
    case "logout":
      return INITIAL_STATE;
    case "new_msg":
      return { ...state, messages: [...state.messages, action.payload] };
    case "lobby_update":
      return { ...state, ...action.payload };

    default:
      throw new Error("Unhandled action");
  }
}

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const channel = useMemo(() => {
    if (!state.user) return null;

    const newChannel = buildChannel(state?.user?.token);

    newChannel.on("new_msg", (message) => {
      dispatch({ type: "new_msg", payload: message });
      playAudio();
    });

    newChannel.on("lobby_update", (lobby) =>
      dispatch({ type: "lobby_update", payload: lobby })
    );

    return newChannel;
  }, [state?.user?.token]);

  useEffect(() => {
    const user = getUserFromStorage();

    if (user) dispatch({ type: "login", payload: user });
  }, []);

  function submitMessage(message) {
    channel.push("new_msg", { body: message });
  }

  async function login(username, password) {
    const response = await axios.post("/api/auth", {
      session: {
        username: username.trim(),
        password,
      },
    });

    sessionStorage.setItem("user", JSON.stringify(response.data));

    dispatch({ type: "login", payload: response.data });
  }

  async function logout() {
    sessionStorage.removeItem("user");
    channel.leave();

    dispatch({ type: "logout" });
  }

  return (
    <ChatContext.Provider
      value={{
        user: state.user,
        users: state.users,
        messages: state.messages,
        login,
        logout,
        submitMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useChatContext() {
  return useContext(ChatContext);
}

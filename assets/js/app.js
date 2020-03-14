import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import { hot } from "react-hot-loader";
import App from "./components/App";

import "../css/app.css";
import "../css/Chat.css";
import "../css/Login.css";
import "../css/Message.css";
import "../css/Users.css";

const HotApp = hot(module)(App);

ReactDOM.render(<HotApp />, document.getElementById("root"));

module.hot.accept();

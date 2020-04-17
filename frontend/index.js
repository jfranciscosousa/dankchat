import "regenerator-runtime/runtime";
import React from "react";
import ReactDOM from "react-dom";
import { hot } from "react-hot-loader";

import App from "./components/App";

const HotApp = hot(module)(App);

window.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<HotApp />, document.getElementById("root"));
});

module.hot.accept();

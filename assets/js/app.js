import "../css/app.css";

import "phoenix_html";
import { Socket } from "phoenix";
import NProgress from "nprogress";
import { LiveSocket } from "phoenix_live_view";
import "./flash";

const csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");
const liveSocket = new LiveSocket("/live", Socket, {
  params: { _csrf_token: csrfToken },
  hooks: {
    ScrollBottom: {
      mounted() {
        this.el.scrollTo(0, this.el.scrollHeight);
      },
      updated() {
        this.el.scrollTo(0, this.el.scrollHeight);
      },
    },
  },
});

window.addEventListener("phx:page-loading-start", () => NProgress.start());
window.addEventListener("phx:page-loading-stop", () => NProgress.done());

liveSocket.connect();

window.liveSocket = liveSocket;

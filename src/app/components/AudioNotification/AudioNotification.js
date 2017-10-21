import React from "react";

let playNotif = false;

window.onfocus = function() {
  playNotif = false;
};

window.onblur = function() {
  playNotif = true;
};

export default class AudioNotification extends React.Component {
  playSound() {
    if (playNotif) this.audio.play();
  }

  render() {
    return <audio id="notif" src="./assets/sounds/notif.mp3" preload="auto" ref={(el) => this.audio = el} />;
  }
}

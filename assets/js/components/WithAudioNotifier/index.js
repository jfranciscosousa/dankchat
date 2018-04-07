import React from "react";
import sound from "../../../static/sounds/notif.mp3";

let withoutFocus = false;

window.onfocus = () => {
  withoutFocus = false;
};

window.onblur = () => {
  withoutFocus = true;
};

export default Child =>
  class AudioNotification extends React.Component {
    playSound = () => {
      if (withoutFocus) this.audio.play();
    };

    render() {
      return (
        <div>
          <audio
            id="notif"
            src={sound}
            preload="auto"
            ref={el => {
              this.audio = el;
            }}
            style={{ display: "none" }}
          />
          <Child {...this.props} playNotification={this.playSound} />
        </div>
      );
    }
  };

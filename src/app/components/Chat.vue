<template>
  <div id="chat" class="chat page">
    <audio id="notif" src="./assets/sounds/notif.mp3" preload="auto" />
    <div class="chatArea">
      <ul class="messages">
        <li class="message" v-for="message in messages" v-bind:key="message.id">
          <span class="username" v-bind:style="{ color: message.color }">[{{message.date}}] {{message.username}} :</span>
          <div class="messageBody">{{message.message}}</div>
        </li>
      </ul>
      <users id="userList" class="userList"></users>
    </div>
    <input v-model="inputMessage" v-on:keyup.enter="onSubmit" id="inputMessage" class="inputMessage" placeholder="Type here..." />
  </div>
</template>

<script>
import socket from "../socket"
import Users from './Users';

let playNotif = false;

window.onfocus = function () {
  playNotif = false;
};

window.onblur = function () {
  playNotif = true;
};

export default {
  components: {
    users: Users
  },
  data() {
    return {
      messages: [],
      inputMessage: ""
    }
  },
  mounted() {
    socket.on("new message", (message) => {
      this.addMessage(message);
    });

    socket.on("message broadcasted", (message) => {
      this.addMessage(message);
      this.inputMessage = "";
    })
  },
  methods: {
    onSubmit() {
      if (this.inputMessage != "")
        socket.emit("new message", this.inputMessage);
    },
    addMessage(message) {
      let d = new Date();
      let options = {
        hour: "2-digit",
        minute: "2-digit"
      };
      message.date = d.toLocaleTimeString("pt-PT", options);
      message.color = getColor(message.username);
      this.playSound();
      this.messages.push(message);
    },
    playSound() {
      let notif = document.getElementById("notif");
      if (playNotif) notif.play();
    }
  },
  updated() {
    var elem = this.$el.querySelector(".messages");
    elem.scrollTop = elem.clientHeight;
  },
}

function getColor(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}
</script>

<style>
* {
  box-sizing: border-box;
}

html {
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}

html,
input {
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

ul {
  list-style: none;
  word-wrap: break-word;
}

.page {
  height: 100%;
  position: absolute;
  width: 100%;
}

.messages {
  font-size: 150%;
}

.inputMessage {
  font-size: 100%;
}

.log {
  color: gray;
  font-size: 70%;
  margin: 5px;
  text-align: center;
}

.message {
  height: auto;
  position: relative;
  display: list-item;
}

.chatArea {
  height: 100%;
  padding-bottom: 60px;
}

.messages {
  height: 100%;
  width: 80%;
  float: left;
  overflow-y: scroll;
  padding: 10px 20px 10px 20px;
}

.userList {
  height: 100%;
  width: 20%;
  display: inline-block;
  *display: inline;
  zoom: 1;
  float: right;
  font-size: 150%;
  overflow-y: scroll;
}

.message.typing .messageBody {
  color: gray;
}

.messageBody {
  line-height: 50px;
}

.username {
  float: left;
  font-weight: 700;
  overflow: hidden;
  padding-right: 15px;
  text-align: right;
  display: inline-block;
  line-height: 50px;
}

.inputMessage {
  border: 10px solid #000;
  bottom: 0;
  height: 60px;
  left: 0;
  outline: none;
  padding-left: 10px;
  position: absolute;
  right: 0;
  width: 100%;
}
</style>

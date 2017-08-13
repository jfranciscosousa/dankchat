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
      if (this.inputMessage != "") socket.emit("new message", this.inputMessage);
    },
    addMessage(message) {
      message.date = getDate();
      message.color = getColor(message.username);
      playSound();
      this.messages.push(message);
    }
  },
  updated() {
    var elem = this.$el.querySelector(".Chat-messages");
    elem.scrollTop = elem.scrollHeight;
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

function getDate() {
  let date = new Date();
  let options = {
    hour: "2-digit",
    minute: "2-digit"
  };

  return date.toLocaleTimeString("pt-PT", options);
}

function playSound() {
  let notif = document.getElementById("notif");
  if (playNotif) notif.play();
}
</script>

<template>
  <div id="chat" class="container-fluid p-0 m-0 Chat-page">
    <audio id="notif" src="./assets/sounds/notif.mp3" preload="auto" />
    <div class="row Chat-chatArea">
      <ul class="col-9 Chat-messages">
        <li v-for="message in messages" v-bind:key="message.id">
          <div class="row">
            <span class="Chat-username" v-bind:style="{ color: message.color }">[{{message.date}}] {{message.username}} :</span>
            <div class="Chat-messageBody">{{message.message}}</div>
          </div>
        </li>
      </ul>
      <users class="col-3 Chat-users"></users>
    </div>
    <input v-model="inputMessage" v-on:keyup.enter="onSubmit" class="Chat-inputMessage" placeholder="Type here..." />
  </div>
</template>

<style lang="scss">
$inputHeight: 60px;

.row {
  margin: 0px;
  padding: 0px;
}

[class*='col-'] {
  margin: 0px;
  padding: 0px;
}

.Chat-page {
  height: 100vh;
}

ul {
  list-style: none;
  word-wrap: break-word;
}

.Chat-chatArea {
  height: calc(100vh - #{$inputHeight})
}

.Chat-users {
  overflow-y: scroll;
}

.Chat-log {
  color: gray;
  font-size: 70%;
  margin: 5px;
  text-align: center;
}

.Chat-messages {
  height: 100%;
  width: 80%;
  float: left;
  font-size: 150%;
  overflow-y: scroll;
  padding: 10px 20px 10px 20px;
}

.Chat-users {
  height: 100%;
  width: 20%;
  display: inline-block;
  *display: inline;
  zoom: 1;
  font-size: 150%;
  overflow-y: scroll;
}

.Chat-messageBody {
  line-height: 50px;
}

.Chat-username {
  font-weight: 700;
  overflow: hidden;
  padding-right: 15px;
  text-align: right;
  display: inline-block;
  line-height: 50px;
}

.Chat-inputMessage {
  border: 10px solid #000;
  bottom: 0;
  height: $inputHeight;
  left: 0;
  outline: none;
  padding-left: 10px;
  right: 0;
  width: 100%;
}
</style>

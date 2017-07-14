<template>
  <router-view>
  </router-view>
</template>

<script>
import socket from "../socket"
import 'bootstrap/dist/css/bootstrap.css';

export default {
  beforeMount() {
    let user = localStorage.getItem("user");

    if (user) {
      user = JSON.parse(user);

      socket.emit("auth user", {
        username: user.username,
        password: user.password
      });

      socket.on("login", (data) => {
        data.loggedUsers.forEach((user) => {
          this.$store.commit("addUser", user)
        });
        this.$router.replace("chat");
      });
    }
  }
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

.page {
  height: 100%;
  position: absolute;
  width: 100%;
}
</style>

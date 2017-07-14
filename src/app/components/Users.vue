<template>
  <ul class="list-group">
    <li class="list-group-item" v-for="user in users" v-bind:key="user.username">
      {{user}}
    </li>
  </ul>
</template>

<script>
import socket from "../socket"

export default {
  computed: {
    users() {
      return this.$store.state.users
    }
  },
  mounted() {
    let user = JSON.parse(localStorage.getItem("user"));

    socket.on("user joined", (data) => {
      this.$store.commit("addUser", data.username);
    });

    socket.on("user left", (data) => {
      this.$store.commit("removeUser", data.username);
    });
  }
}
</script>

<style>
.userList {
  float: left;
  height: 100%;
  width: 20%;
  margin: 0;
  font-size: 150%;
  overflow-y: scroll;
}
</style>

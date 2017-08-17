<template>
  <div class="login page">
    <form class="form" v-on:keyup.enter="onSubmit">
      <h3 class="title">DankName</h3>
      <input id="usernameInput" class="textInput" type="text" maxlength="14" v-model="username" />
      <h3 class="title">DankPass</h3>
      <input id="passwordInput" input type="password" class="textInput" maxlength="14" v-model="password" />
      <h3 id="errorMessage" class="title" />
    </form>
  </div>
</template>

<script>
import socket from "../socket"

export default {
  data() {
    return {
      username: "",
      password: ""
    }
  },
  methods: {
    onSubmit() {
      if (this.username) {
        localStorage.setItem("user", JSON.stringify({ username: this.username, password: this.password }));

        socket.emit("auth user", {
          username: this.username.trim(),
          password: this.password
        });
      }
    }
  },
  beforeMount(){
    socket.on("login-fail", data => console.log(data.reason));
  }
}

</script>

<style>
.login.page {
  background-size: cover;
  background-color: #000;
  background-image: url("/assets/images/rarepepe.jpg");
}

.login.page .form {
  height: 100px;
  margin-top: -100px;
  position: absolute;
  text-align: center;
  top: 50%;
  width: 100%;
}

.login.page .form .textInput {
  background-color: transparent;
  border: none;
  border-bottom: 2px solid #fff;
  outline: none;
  padding-bottom: 15px;
  text-align: center;
  width: 400px;
}

.login.page .title {
  font-size: 200%;
}

.login.page .textInput {
  font-size: 200%;
  letter-spacing: 3px;
}

.login.page .title,
.login.page .textInput {
  color: #fff;
  font-weight: 100;
}
</style>

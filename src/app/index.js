import Vue from 'vue'
import VueRouter from "vue-router"
import Vuex from "vuex"
import App from "./components/App"
import Login from "./components/Login"
import Chat from "./components/Chat"

Vue.use(VueRouter)
Vue.use(Vuex)

const routes = [
  { path: '*', redirect: '/login' },
  { path: '/login', component: Login, name: "login" },
  { path: '/chat', component: Chat, name: "chat" }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

const users = new Array();

const store = new Vuex.Store({
  state: {
    users
  },
  mutations: {
    addUser(state, user) {
      if (state.users.indexOf(user) === -1) state.users.push(user);
    },
    removeUser(state, user){
      let index = state.users.indexOf(user);
      if (index > -1) {
        state.users.splice(index, 1);
      }
    }
  },
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

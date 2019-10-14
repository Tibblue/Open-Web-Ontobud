import Vue from 'vue'
import Vuex from 'vuex'
import VueSession from 'vue-session'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueSession)

const store = new Vuex.Store({
  state: {
    $repo: {
      id: "No id",
      name: "No name",
    }
  },
  mutations: {
    update$repo: function(state, newRepo) {
      state.$repo = newRepo;
    },
  }
});

new Vue({
  store: store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

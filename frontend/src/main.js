import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import VueSession from 'vue-session'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueSession, { persist: true })

function defaultState () {
  return {
    $repo: {
      id: undefined,
      name: undefined
    },
    $backurl: {
      host: process.env.VUE_APP_BACKEND_HOST,
      port: process.env.VUE_APP_BACKEND_PORT
    },
    test: undefined
  }
}
const store = new Vuex.Store({
  state: defaultState(),
  mutations: {
    update$repo (state, newRepo) {
      state.$repo = newRepo
    },
    update_backurl (state, newBackURL) {
      state.$backurl = newBackURL
    },
    updatetest (state, newtest) {
      state.test = newtest
    },
    reset (state) {
      const s = defaultState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }
  },
  plugins: [createPersistedState()]
})

new Vue({
  store: store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

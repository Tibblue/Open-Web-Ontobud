import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import VueSession from 'vue-session'
import Vuetify from 'vuetify';
import './plugins/vuetify'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

Vue.config.productionTip = false
// Vue.use(VueSession)
Vue.use(Vuetify)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

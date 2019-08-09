import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueSession from 'vue-session'
import './plugins/vuetify'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

Vue.use(VueSession)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

<template>
  <v-card class="pa-3">
    <v-form v-model="validForm" ref="form">
      <v-text-field filled required
        v-model="userEmail"
        label="Email"
        :rules="[rules.required, rules.email]"
      ></v-text-field>
      <!-- <div class="mb-4"></div> -->
      <v-text-field filled required counter
        v-model="userPass"
        label="Password"
        :rules="[rules.required, rules.counter]"
        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPass ? 'text' : 'password'"
        @click:append="showPass = !showPass"
      ></v-text-field>
      <div class="mb-2"></div>
      <v-btn block color="primary"
        :disabled="!validForm"
        :loading="loading.login"
        @click="login(userEmail, userPass)"
      >
        Login
      </v-btn>
      <div class="mb-2"></div>
      <v-alert text dismissible type="success" v-model="alert.loginSuccess">
        Login Successful!!!
      </v-alert>
      <v-alert text dismissible type="error" v-model="alert.loginFail">
        {{this.alert.loginFailMessage}}
      </v-alert>
    </v-form>
  </v-card>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
const qs = require('querystring')

export default {
  data: () => ({
    validForm: false,
    userEmail: '',
    userPass: '',
    showPass: false,
    rules: {
      required: value => !!value || 'Required',
      counter: value => value.length >= 4 || 'Min 4 characters',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail'
      }
    },
    loading: {
      login: false
    },
    alert: {
      loginSuccess: false,
      loginFail: false,
      loginFailMessage: 'Login Failed...'
    }
  }),
  // mounted: async function (){
  //   // console.log(process.env) # debug
  // },
  computed: {
    $backurl: {
      get: Vuex.mapState(['$backurl']).$backurl,
      set: Vuex.mapMutations(['update_backurl']).update_backurl
    },
    backendURL: function () {
      var backendURL = 'http://' + this.$backurl.host + ':' + this.$backurl.port
      return backendURL
    }
  },
  methods: {
    login (userEmail, userPass) {
      if (!this.userEmail || !this.userPass) {
        this.alert.loginSuccess = false
        this.alert.loginFail = true
        this.alert.loginFailMessage = 'All fields are required'
      } else {
        this.loading.login = true
        var form = {}
        form.email = userEmail
        form.password = userPass
        axios.post(this.backendURL + '/api/auth/login', qs.stringify(form),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )
          .then(response => {
            // console.log(response.data.head) // debug column names
            // console.log(response.data.results.bindings) // debug results
            var token = response.data.token
            var userInfo = response.data.userInfo
            this.$session.set('userToken', token)
            this.$session.set('userName', userInfo.name)
            this.$session.set('userEmail', userInfo.email)
            this.$session.flash.set('login', { msg: 'Login Success!!!', color: 'success' })

            this.alert.loginSuccess = true
            this.alert.loginFail = false
            this.$router.go(0)
          })
          .catch(alert => {
            // console.log(alert.response.data) // debug
            this.alert.loginSuccess = false
            this.alert.loginFail = true
            this.alert.loginFailMessage = 'Login Failed...'
          })
          .finally(() => {
            this.loading.login = false
          })
      }
    }
  }
}
</script>

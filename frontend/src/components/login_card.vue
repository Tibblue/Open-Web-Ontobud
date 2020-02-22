<template>
  <v-card class="pa-3">
    <v-text-field hide-details class="mt-0 mb-4 pt-0"
      v-model="userEmail"
      label="Email"
      required
      filled
    ></v-text-field>
    <v-text-field hide-details class="mt-0 mb-4 pt-0"
      v-model="userPass"
      label="Password"
      required
      filled
    ></v-text-field>
    <v-btn :loading="loading.login" block color="primary" @click="login(userEmail, userPass)">
      Login
    </v-btn>
    <v-alert text dismissible type="success" v-model="alert.loginSuccess">
      Login Successful!!!
    </v-alert>
    <v-alert text dismissible type="error" v-model="alert.loginFail">
      {{this.alert.loginFailMessage}}
    </v-alert>
  </v-card>
</template>

<script>
import axios from 'axios'
const qs = require('querystring')
const backend_url = "http://"+process.env.VUE_APP_BACKEND_HOST+":"+process.env.VUE_APP_BACKEND_PORT

export default {
  data: () => ({
    userEmail: "",
    userPass: "",
    loading: {
      login: false,
    },
    alert: {
      loginSuccess: false,
      loginFail: false,
      loginFailMessage: "Login Failed...",
    },
  }),
  // mounted: async function (){
  //   // console.log(process.env) # debug
  // },
  methods: {
    login(userEmail, userPass) {
      if( !this.userEmail || !this.userPass ){
        this.alert.loginSuccess = false
        this.alert.loginFail = true
        this.alert.loginFailMessage = "All fields are required"
      }
      else{
        this.loading.login = true
        var form = {}
        form['email'] = userEmail
        form['password'] = userPass
        axios.post(backend_url+'/auth/login', qs.stringify(form),
          {headers: {"Content-Type": 'application/x-www-form-urlencoded'}}
        )
          .then(response => {
            // console.log(response.data.head) // debug column names
            // console.log(response.data.results.bindings) // debug results
            var token = response.data
            this.$session.set("userToken", token)
            this.$session.set("userEmail", userEmail)

            this.alert.loginSuccess = true
            this.alert.loginFail = false
            this.$router.go(0)
          })
          .catch(alert => {
            // console.log(alert.response.data) // debug
            this.alert.loginSuccess = false
            this.alert.loginFail = true
            this.alert.loginFailMessage = "Login Failed..."
          })
          .finally(() => {
            this.loading.login = false
          })
      }
    },
  },
};
</script>

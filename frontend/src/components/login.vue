<template>
  <v-row>
    <v-col cols="12">
      <v-text-field hide-details class="mt-0 mb-3 pt-0"
        v-model="loginEmail"
        label="Email"
      ></v-text-field>
      <v-text-field hide-details class="mt-0 mb-3 pt-0"
        v-model="loginPass"
        label="Password"
      ></v-text-field>
      <v-btn :loading="loading.userLogin" block color="primary" @click="login(loginEmail, loginPass)">
        Login
      </v-btn>
      <v-alert text dismissible type="success" v-model="alert.userLoginSuccess">
        Login Successful!!!
      </v-alert>
      <v-alert text dismissible type="error" v-model="alert.userLoginFail">
        Login Failed...
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
const qs = require('querystring')
const backend_url = "http://"+process.env.VUE_APP_URL+":"+process.env.VUE_APP_BACKEND_PORT

export default {
  data: () => ({
    loginEmail: "",
    loginPass: "",
    loading: {
      userLogin: false,
    },
    alert: {
      userLoginSuccess: false,
      userLoginFail: false,
    },
  }),
  // mounted: async function (){
  //   // console.log(process.env) # debug
  // },
  methods: {
    login(userEmail, userPass) {
      this.loading.userLogin = true
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

          this.alert.userLoginSuccess = true
          this.alert.userLoginFail = false
          this.$router.go(0)
        })
        .catch(alert => {
          console.log(alert.response.data)
          this.alert.userLoginSuccess = false
          this.alert.userLoginFail = true
        })
        .finally(() => {
          this.loading.userLogin = false
        })
    },
  },
};
</script>

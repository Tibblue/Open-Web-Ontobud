<template>
  <v-card class="pa-3">
    <v-text-field hide-details class="mt-0 mb-4 pt-0"
      v-model="userName"
      label="name"
      required
      filled
    ></v-text-field>
    <v-text-field hide-details class="mt-0 mb-4 pt-0"
      v-model="userEmail"
      label="Email"
      required
      filled
    ></v-text-field>
    <v-text-field hide-details class="mt-0 mb-4 pt-0"
      v-model="userPass"
      label="Password"
      :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPass ? 'text' : 'password'"
      @click:append="showPass = !showPass"
      required
      filled
    ></v-text-field>
    <v-btn :loading="loading.userSignUp" block color="primary" @click="signUp(userName, userEmail, userPass)">
      Sign Up
    </v-btn>
    <v-alert text dismissible type="success" v-model="alert.userSignUpSuccess">
      Sign Up Successful!!!
    </v-alert>
    <v-alert text dismissible type="error" v-model="alert.userSignUpFail">
      {{this.alert.userSignUpFailMessage}}
    </v-alert>
  </v-card>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
const qs = require('querystring')

export default {
  data: () => ({
    userName: '',
    userEmail: '',
    userPass: '',
    showPass: false,
    loading: {
      userSignUp: false
    },
    alert: {
      userSignUpSuccess: false,
      userSignUpFail: false,
      userSignUpFailMessage: 'Sign Up Failed...'
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
    backend_url: function () {
      var backend_url = 'http://' + this.$backurl.host + ':' + this.$backurl.port
      return backend_url
    }
  },
  methods: {
    signUp (userName, userEmail, userPass) {
      if (!this.userName || !this.userEmail || !this.userPass) {
        this.alert.userSignUpSuccess = false
        this.alert.userSignUpFail = true
        this.alert.userSignUpFailMessage = 'All fields are required'
      } else {
        this.loading.userSignUp = true
        var form = {}
        form.name = userName
        form.email = userEmail
        form.password = userPass
        axios.post(this.backend_url + '/api/auth/signup', qs.stringify(form),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )
          .then(response => {
            // console.log(response.data.head) // debug column names
            // console.log(response.data.results.bindings) // debug results
            this.alert.userSignUpSuccess = true
            this.alert.userSignUpFail = false
          })
          .catch(alert => {
            console.log(alert.response.data)
            this.alert.userSignUpSuccess = false
            this.alert.userSignUpFail = true
            this.alert.userSignUpFailMessage = 'Sign Up Failed...'
          })
          .finally(() => {
            this.loading.userSignUp = false
          })
      }
    }
  }
}
</script>

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
import axios from 'axios'
const qs = require('querystring')
const backend_url = "http://localhost:"+process.env.VUE_APP_BACKEND_PORT

export default {
  data: () => ({
    userName: "",
    userEmail: "",
    userPass: "",
    loading: {
      userSignUp: false,
    },
    alert: {
      userSignUpSuccess: false,
      userSignUpFail: false,
      userSignUpFailMessage: "Sign Up Failed...",
    },
  }),
  // mounted: async function (){
  //   // console.log(process.env) # debug
  // },
  methods: {
    signUp(userName, userEmail, userPass) {
      if( !this.userName || !this.userEmail || !this.userPass ){
        this.alert.userSignUpSuccess = false
        this.alert.userSignUpFail = true
        this.alert.userSignUpFailMessage = "All fields are required"
      }
      else{
        this.loading.userSignUp = true
        var form = {}
        form['name'] = userName
        form['email'] = userEmail
        form['password'] = userPass
        axios.post(backend_url+'/auth/signup', qs.stringify(form),
          {headers: {"Content-Type": 'application/x-www-form-urlencoded'}}
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
            this.alert.userSignUpFailMessage = "Sign Up Failed..."
          })
          .finally(() => {
            this.loading.userSignUp = false
          })
      }
    },
  },
};
</script>

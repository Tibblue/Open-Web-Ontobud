<template>
  <v-row>
    <v-col cols="12">
      <v-textarea outlined auto-grow hide-details
        v-model="message"
        rows="6"
        row-height="22"
        label="Feedback"
        placeholder="Feedback message"
      ></v-textarea>
      <v-slider
        v-model="rating"
        label="Rate 0-10⭐"
        min="0"
        max="10"
        thumb-label="always"
      >
        <template v-slot:thumb-label="{ value }">
          {{ value=rating+"⭐" }}
        </template>
        <!-- <template v-slot:thumb-label="{ value }">
          {{ satisfactionEmojis[Math.min(Math.floor(value / 10), 9)] }}
        </template> -->
      </v-slider>
      <v-btn :loading="loading.feedbackSubmit" block color="primary" @click="feedback(message, rating)">
        Submit Feedback
      </v-btn>
      <v-alert text dismissible type="success" v-model="alert.feedbackSubmitSuccess">
        Submit Successful!!!
      </v-alert>
      <v-alert text dismissible type="error" v-model="alert.feedbackSubmitFail">
        Submit Failed...
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
const qs = require('querystring')
const backend_url = "http://"+process.env.VUE_APP_BACKEND_HOST+":"+process.env.VUE_APP_BACKEND_PORT

export default {
  data: () => ({
    // satisfactionEmojis: ['😭', '😢', '☹️', '🙁', '😐', '🙂', '😊', '😁', '😄', '😍'],
    rating: 5,
    message: "",
    loading: {
      feedbackSubmit: false,
    },
    alert: {
      feedbackSubmitSuccess: false,
      feedbackSubmitFail: false,
    },
  }),
  // mounted: async function (){
  //   // console.log(process.env) # debug
  // },
  methods: {
    feedback(message, rating) {
      this.loading.feedbackSubmit = true
      var form = {}
      form['message'] = message
      form['rating'] = rating
      axios.post(backend_url+'/api/feedback', qs.stringify(form),
        {headers: {"Content-Type": 'application/x-www-form-urlencoded'}}
      )
        .then(response => {
          // console.log(response.data.head) // debug column names
          // console.log(response.data.results.bindings) // debug results
          this.alert.feedbackSubmitSuccess = true
          this.alert.feedbackSubmitFail = false
        })
        .catch(alert => {
          console.log(alert.response.data)
          this.alert.feedbackSubmitSuccess = false
          this.alert.feedbackSubmitFail = true
        })
        .finally(() => {
          this.loading.feedbackSubmit = false
        })
    },
  },
};
</script>

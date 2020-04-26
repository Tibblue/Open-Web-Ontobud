<template>
  <v-row dense>
    <v-col cols="12">
      <v-textarea outlined auto-grow hide-details
        v-model="message"
        rows="6"
        row-height="22"
        label="Feedback"
        placeholder="Ideas, Bugs, etc"
      ></v-textarea>
    </v-col>
    <v-col cols="12" class="px-3 py-3">
      <v-slider hide-details
        v-model="rating"
        label="Overall experience (0-10⭐)"
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
    </v-col>
    <v-col cols="12" md="6" class="px-3 py-3">
      <v-slider hide-details
        v-model="intuitive"
        :label="`Intuitive interface ${emojisSatisfaction5[intuitive-1]}`"
        min="1"
        max="5"
      >
        <template v-slot:thumb-label="{ value }">
          {{ value=emojisSatisfaction5[intuitive-1] }}
        </template>
      </v-slider>
    </v-col>
    <v-col cols="12" md="6" class="px-3 py-3">
      <v-slider hide-details
        v-model="style"
        :label="`Interface design ${emojisSatisfaction5[style-1]}`"
        min="1"
        max="5"
      >
        <template v-slot:thumb-label="{ value }">
          {{ value=emojisSatisfaction5[style-1] }}
        </template>
      </v-slider>
    </v-col>
    <v-col cols="12" md="6" class="px-3 py-3">
      <v-slider hide-details
        v-model="useAgain"
        :label="`Would use again? ${emojisYesNo[useAgain+1]}`"
        min="-1"
        max="1"
      >
        <template v-slot:thumb-label="{ value }">
          {{ value=emojisYesNo[useAgain+1] }}
        </template>
      </v-slider>
    </v-col>
    <v-col cols="12" md="6" class="px-3 py-3">
      <v-slider hide-details
        v-model="anyBugs"
        :label="`Any Bugs? ${emojisYesNo[anyBugs+1]}`"
        min="-1"
        max="1"
      >
        <template v-slot:thumb-label="{ value }">
          {{ value=emojisYesNo[anyBugs+1] }}
        </template>
      </v-slider>
    </v-col>
    <v-col cols="12">
      <v-btn :loading="loading.feedbackSubmit" block color="primary" @click="feedback()">
        Submit Feedback
      </v-btn>
      <v-alert text dismissible type="success" v-model="alert.feedbackSubmitSuccess">
        Submit Successful!!! Thank you for your feedback ^w^
      </v-alert>
      <v-alert text dismissible type="error" v-model="alert.feedbackSubmitFail">
        Submit Failed...
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
const qs = require('querystring')

export default {
  data: () => ({
    // emojisSatisfaction10: ['😭', '😢', '☹️', '🙁', '😐', '🙂', '😊', '😁', '😄', '😍'],
    emojisSatisfaction5: ['😭', '☹️', '😐', '😁', '😍'],
    emojisYesNo: ['👎', '🤔', '👍'],
    rating: 5,
    intuitive: 3,
    style: 3,
    useAgain: 0,
    anyBugs: 0,
    message: '',
    loading: {
      feedbackSubmit: false
    },
    alert: {
      feedbackSubmitSuccess: false,
      feedbackSubmitFail: false
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
    feedback () {
      this.loading.feedbackSubmit = true
      var form = {}
      form.message = this.message
      form.rating = this.rating
      form.intuitive = this.intuitive
      form.style = this.style
      form.useAgain = this.useAgain
      form.anyBugs = this.anyBugs
      axios.post(this.backendURL + '/api/feedback', qs.stringify(form),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
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
    }
  }
}
</script>

<template>
  <v-container>
        <div class="text-center">
          <v-btn color="info" @click="snackbarDEBUG=true">
            Confirm current repo (DEBUG)
          </v-btn>
          <v-snackbar top v-model="snackbarDEBUG">
            {{ this.$session.get("repoName") }} - {{ this.$session.get("repoID") }}
            <v-btn @click="snackbarDEBUG=false">Close</v-btn>
          </v-snackbar>
        </div>
  </v-container>
</template>

<script>
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  data: () => ({
    snackbarDEBUG: false,
  }),
  // mounted: async function (){
  //   console.log(this.$props)
  //   console.log(process.env)
  // },
  methods: {
  }
}
</script>
